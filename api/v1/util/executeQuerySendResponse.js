import executeQuery from './executeQuery.js'

const executeQuerySendResponse = async (
    response,
    query,
    params = [],
    columnNames = []
) => {
    const queryType = (string => string.split(' ')[0].toUpperCase())(query)
    const tableName = query
        .match(/(?:FROM|INTO|UPDATE)\s+([a-zA-Z0-9_]+)/i)
        ?. [1] || null

    try {
        const sqlResult = await executeQuery(query, params)

        if (queryType === 'SELECT') {
            if (sqlResult.length === 0 && params.length > 0) {
                return response.status(404).json([])
            }

            return response.status(200).json(
                Array.isArray(sqlResult) ? sqlResult : [sqlResult]
            )
        } 

        else if (queryType === 'INSERT') {
            const insertedRow = await executeQuery(
                `SELECT * FROM ${tableName} WHERE id = ?;`,
                [sqlResult.insertId]
            )

            return response.status(201).json(insertedRow)
        }

        else if (queryType === 'UPDATE') {
            if (sqlResult.affectedRows === 0) {
                return response.status(404).json([])
            }

            const updatedRow = await executeQuery(
                `SELECT * FROM ${tableName} WHERE id = ?;`,
                [params[params.length - 1]]
            )

            return response.status(200).json(updatedRow)
        }

        else if (queryType === 'DELETE') {
            if (sqlResult.affectedRows === 0) {
                return response.status(404).json([])
            }
            
            return response.status(200).json([])
        }

        return response.status(200).json(sqlResult)
    } catch (error) {
        let statusCode = 500
        let message = 'Unexpected error'
        let columnName = 'Value'

        for (let i = 0; i < columnNames.length; i++) {
            if (error.message && error.message.includes(columnNames[i])) {
                columnName =
                    columnNames[i].replace(/^./, word => word.toUpperCase())
                break  
            }
        }

        if (
            error.code === 'ER_NO_DEFAULT_FOR_FIELD' ||
            (
                typeof error?.message === 'string' &&
                error.message.includes('parameters must not contain undefined')
            )
        ) {
            statusCode = 400
            message = 'Required field(s) missing'
        }

        else if (error.code === 'ER_BAD_NULL_ERROR') {
            statusCode = 400
            message = `${columnName} required`
        }
        
        else if (
            error.code === 'ER_DATA_TOO_LONG' ||
            error.code === 'ER_TRUNCATED_WRONG_VALUE'
        ) {
            statusCode = 400
            message = `${columnName} too long`
        }
        
        else if (
            error.code === 'ER_CHECK_CONSTRAINT_VIOLATED' ||
            error.code === 'ER_ILLEGAL_VALUE_FOR_TYPE' ||
            error.code === 'ER_WRONG_STRING_LENGTH'
        ) {
            statusCode = 400
            message = `${columnName} format invalid`
        }

        else if (error.code === 'WARN_DATA_TRUNCATED') {
            statusCode = 400
            message = `${columnName} invalid`
        }
        
        else if (error.code === 'ER_DUP_ENTRY') {
            statusCode = 422
            message = `${columnName} taken`
        }

        return response.status(statusCode).json([message])
    }
}

export default executeQuerySendResponse
