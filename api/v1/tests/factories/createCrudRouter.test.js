import { describe, it, expect, afterEach, beforeEach, jest } from '@jest/globals'
import request from 'supertest'
import express from 'express'
import createCrudRouter from '../../factories/createCrudRouter.js'
import executeQuerySendResponse from '../../util/executeQuerySendResponse.js'
import { formatInsert, formatUpdate } from '../../util/queryHelper.js'

jest.mock('../../util/executeQuerySendResponse.js')
jest.mock('../../util/queryHelper.js')

describe('createCrudRouter', () => {
    let app

    beforeEach(() => {
        app = express()
        app.use(express.json())
        app.use('/api/v1/users', createCrudRouter('users'))

        executeQuerySendResponse.mockImplementation(response => {
            response.status(200).json({ ok: true })
        })
    })

    afterEach(() => jest.clearAllMocks())

    it('handles GET /', async () => {
        await request(app).get('/api/v1/users').expect(200)

        expect(executeQuerySendResponse).toHaveBeenCalledWith(
            expect.any(Object),
            'SELECT * FROM users;'
        )
    })

    it('handles GET /:id', async () => {
        await request(app).get('/api/v1/users/1').expect(200)

        expect(executeQuerySendResponse).toHaveBeenCalledWith(
            expect.any(Object),
            'SELECT * FROM users WHERE id = ?;',
            ['1']
        )
    })

    it('handles POST /', async () => {
        const requestBody = { name: 'Michael', city: 'New York' }
        const columnNames = ['name', 'city']
        const queryParams = ['Michael', 'New York']
        const placeholders = '?, ?'

        formatInsert.mockReturnValue([columnNames, queryParams, placeholders])

        await request(app)
            .post('/api/v1/users')
            .send(requestBody)
            .expect(200)

        expect(formatInsert).toHaveBeenCalledWith(requestBody)
        expect(executeQuerySendResponse).toHaveBeenCalledWith(
            expect.any(Object),
            'INSERT INTO users (name, city)\n            VALUES (?, ?);',
            queryParams,
            columnNames
        )
    })

    it('handles PATCH /:id', async () => {
        const requestBody = { name: 'Michael', city: 'New York' }
        const columnNames = ['name', 'city']
        const setClause = 'name = ?, city = ?'
        const queryParams = ['Michael', 'New York', '1']

        formatUpdate.mockReturnValue([columnNames, setClause, queryParams])

        await request(app)
            .patch('/api/v1/users/1')
            .send(requestBody)
            .expect(200)

        expect(formatUpdate).toHaveBeenCalledWith(requestBody, '1')
        expect(executeQuerySendResponse).toHaveBeenCalledWith(
            expect.any(Object),
            'UPDATE users SET name = ?, city = ? WHERE id = ?;',
            queryParams,
            columnNames
        )
    })

    it('handles DELETE /:id', async () => {
        await request(app).delete('/api/v1/users/1').expect(200)

        expect(executeQuerySendResponse).toHaveBeenCalledWith(
            expect.any(Object),
            'DELETE FROM users WHERE id = ?;',
            ['1']
        )
    })
})
