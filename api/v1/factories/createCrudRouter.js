import express from 'express'
import executeQuerySendResponse from '../util/executeQuerySendResponse.js'
import { formatInsert, formatUpdate } from '../util/queryHelper.js'

const createCrudRouter = tableName => {
    const router = express.Router()

    router.get('/', async (request, response) => {
        await executeQuerySendResponse(response, `SELECT * FROM ${tableName};`)
    })

    router.get('/:id', async (request, response) => {
        await executeQuerySendResponse(
            response,
            `SELECT * FROM ${tableName} WHERE id = ?;`,
            [request.params.id]
        )
    })

    router.post('/', async (request, response) => {
        const [columnNames, queryParams, placeholders] =
            formatInsert(request.body)

        await executeQuerySendResponse(
            response,
            `INSERT INTO ${tableName} (${columnNames.join(', ')})
            VALUES (${placeholders});`,
            queryParams,
            columnNames
        )
    })

    router.patch('/:id', async (request, response) => {
        const [columnNames, setClause, queryParams] =
            formatUpdate(request.body, request.params.id)

        await executeQuerySendResponse(
            response,
            `UPDATE ${tableName} SET ${setClause} WHERE id = ?;`,
            queryParams,
            columnNames
        )
    })

    router.delete('/:id', async (request, response) => {
        await executeQuerySendResponse(
            response,
            `DELETE FROM ${tableName} WHERE id = ?;`,
            [request.params.id]
        )
    })

    return router
}

export default createCrudRouter
