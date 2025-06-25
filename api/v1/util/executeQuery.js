import dbConnection from '../db/dbConnection.js'

const executeQuery = async (query, params = []) => {
    try {
        const [sqlResult] = await dbConnection.execute(query, params)
        
        return sqlResult
    } catch (error) {
        console.error(
            `Error${error.code ? ` ${error.code}` : ''}: ${error.message}`
        )

        if (error.stack) console.error(error.stack)

        throw error
    }
}

export default executeQuery
