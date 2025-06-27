const handleDbError = (response, error, columnNames = []) => {
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

    console.error(
        `Error${error.code ? ` ${error.code}` : ''}: ${error.message}`
    )

    if (error.stack) console.error(error.stack)    

    return response.status(statusCode).json([message])
}

export default handleDbError
