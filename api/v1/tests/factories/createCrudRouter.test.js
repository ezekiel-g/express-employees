import { describe, it, expect, beforeAll, afterAll, jest }
    from '@jest/globals'
import request from 'supertest'
import express from 'express'
import createCrudRouter from '../../factories/createCrudRouter.js'
import dbConnection from '../../db/dbConnection.js'
import handleDbError from '../../util/handleDbError.js'
import { formatInsert, formatUpdate } from '../../util/queryHelper.js'

jest.mock('../../db/dbConnection.js')
jest.mock('../../util/handleDbError.js')
jest.mock('../../util/queryHelper.js')

describe('createCrudRouter', () => {
    let app

    beforeAll(() => {
        app = express()
        app.use(express.json())
        app.use('/api/v1/users', createCrudRouter('users'))

        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterAll(() => console.error.mockRestore())

    it('returns 200 and all rows on GET /', async () => {
        dbConnection.execute.mockResolvedValueOnce([[{ id: 1, name: 'Mary' }]])

        const response = await request(app).get('/api/v1/users')

        expect(response.status).toBe(200)
        expect(response.body).toEqual([{ id: 1, name: 'Mary' }])
    })

    it('returns 200 and specific row on GET /:id', async () => {
        dbConnection.execute.mockResolvedValueOnce([[{ id: 1, name: 'Mary' }]])

        const response = await request(app).get('/api/v1/users/1')

        expect(response.status).toBe(200)
        expect(response.body).toEqual([{ id: 1, name: 'Mary' }])
    })

    it('returns 404 if no row found on GET /:id', async () => {
        dbConnection.execute.mockResolvedValueOnce([[]])

        const response = await request(app).get('/api/v1/users/9999')

        expect(response.status).toBe(404)
        expect(response.body).toEqual([])
    })

    it('returns 201 and new row on POST /', async () => {
        formatInsert.mockReturnValue([
            ['name'],
            ['Mary'],
            '?'
        ])

        dbConnection.execute
            .mockResolvedValueOnce([{ insertId: 1 }])
            .mockResolvedValueOnce([[{ id: 1, name: 'Mary' }]])

        const response = await request(app)
            .post('/api/v1/users')
            .send({ name: 'Mary' })

        expect(response.status).toBe(201)
        expect(response.body).toEqual([{ id: 1, name: 'Mary' }])
    })

    it('returns 200 and updated row on PATCH /:id', async () => {
        formatUpdate.mockReturnValue([
            ['name'],
            'name = ?',
            ['Mary', '1']
        ])

        dbConnection.execute
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([[{ id: 1, name: 'Mary' }]])

        const response = await request(app)
            .patch('/api/v1/users/1')
            .send({ name: 'Mary' })

        expect(response.status).toBe(200)
        expect(response.body).toEqual([{ id: 1, name: 'Mary' }])
    })

    it('returns 404 if no row found on PATCH /:id', async () => {
        formatUpdate.mockReturnValue([
            ['name'],
            'name = ?',
            ['Nobody', '9999']
        ])

        dbConnection.execute.mockResolvedValueOnce([{ affectedRows: 0 }])

        const response = await request(app)
            .patch('/api/v1/users/9999')
            .send({ name: 'Nobody' })

        expect(response.status).toBe(404)
        expect(response.body).toEqual([])
    })

    it('returns 200 and deletes row on DELETE /:id', async () => {
        dbConnection.execute.mockResolvedValueOnce([{ affectedRows: 1 }])

        const response = await request(app).delete('/api/v1/users/1')

        expect(response.status).toBe(200)
        expect(response.body).toEqual([])
    })

    it('returns 404 if no row found on DELETE /:id', async () => {
        dbConnection.execute.mockResolvedValueOnce([{ affectedRows: 0 }])

        const response = await request(app).delete('/api/v1/users/9999')

        expect(response.status).toBe(404)
        expect(response.body).toEqual([])
    })

    it('calls handleDbError on GET / failure', async () => {
        const error = new Error()

        dbConnection.execute.mockRejectedValueOnce(error)

        handleDbError.mockImplementation(
            response => response.status(500).json(['error'])
        )

        await request(app).get('/api/v1/users')

        expect(handleDbError).toHaveBeenCalledWith(expect.any(Object), error)
    })
})
