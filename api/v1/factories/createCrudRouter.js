import express from 'express'
import dbConnection from '../db/dbConnection.js'
import handleDbError from '../util/handleDbError.js'
import { formatInsert, formatUpdate } from '../util/queryHelper.js'

const createCrudRouter = tableName => {
    const router = express.Router()

    router.get('/', async (request, response) => {
        try {
            const [sqlResult] = await dbConnection.execute(
                `SELECT * FROM ${tableName};`
            )

            return response.status(200).json(sqlResult)            
        } catch (error) {
            return handleDbError(response, error)
        }
    })

    router.get('/:id', async (request, response) => {
        try {
            const [sqlResult] = await dbConnection.execute(
                `SELECT * FROM ${tableName} WHERE id = ?;`,
                [request.params.id]
            )

            if (sqlResult.length === 0) {
                return response.status(404).json([])
            }

            return response.status(200).json(sqlResult)            
        } catch (error) {
            return handleDbError(response, error)
        }
    })

    router.post('/', async (request, response) => {
        const [columnNames, queryParams, placeholders] =
            formatInsert(request.body)

        try {
            const [sqlResult] = await dbConnection.execute(
                `INSERT INTO ${tableName} (${columnNames.join(', ')})
                VALUES (${placeholders});`,
                queryParams
            )

            const [insertedRow] = await dbConnection.execute(
                `SELECT * FROM ${tableName} WHERE id = ?;`,
                [sqlResult.insertId]
            )
            
            return response.status(201).json(insertedRow)
        } catch (error) {
            return handleDbError(response, error, columnNames)
        }
    })

    router.patch('/:id', async (request, response) => {
        const [columnNames, setClause, queryParams] =
            formatUpdate(request.body, request.params.id)

        try {
            const [sqlResult] = await dbConnection.execute(
                `UPDATE ${tableName} SET ${setClause} WHERE id = ?;`,
                queryParams
            )    

            if (sqlResult.affectedRows === 0) {
                return response.status(404).json([])
            }

            const [updatedRow] = await dbConnection.execute(
                `SELECT * FROM ${tableName} WHERE id = ?;`,
                [request.params.id]
            )

            return response.status(200).json(updatedRow)
        } catch (error) {
            return handleDbError(response, error, columnNames)
        }        
    })

    router.delete('/:id', async (request, response) => {
        try {
            const [sqlResult] = await dbConnection.execute(
                `DELETE FROM ${tableName} WHERE id = ?;`,
                [request.params.id]
            )

            if (sqlResult.affectedRows === 0) {
                return response.status(404).json([])
            }

            return response.status(200).json([])
        } catch (error) {
            return handleDbError(response, error)
        }
    })

    return router
}

export default createCrudRouter
