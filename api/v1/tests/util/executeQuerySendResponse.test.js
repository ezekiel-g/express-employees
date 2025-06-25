import { describe, it, expect, afterEach, jest } from '@jest/globals'
import executeQuerySendResponse from '../../util/executeQuerySendResponse.js'
import executeQuery from '../../util/executeQuery.js'

jest.mock('../../util/executeQuery.js')

describe('executeQuerySendResponse', () => {
    const createMockResponse = () => {
        const response = {}
        response.status = jest.fn().mockReturnValue(response)
        response.json = jest.fn().mockReturnValue(response)

        return response
    }

    afterEach(() => jest.clearAllMocks())

    it('returns 200 and array with data on SELECT', async () => {
        const response = createMockResponse()
        const mockData = [{ id: 1, name: 'Michael', city: 'New York'}]
        const query = 'SELECT * FROM users WHERE id = ?;'
        const params = [1]

        executeQuery.mockResolvedValue(mockData)

        const result = await executeQuerySendResponse(response, query, params)

        expect(executeQuery).toHaveBeenCalledWith(query, params)
        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith(mockData)
        expect(result).toBe(response)
    })

    it('returns 200 and [] if there are no table rows at all', async () => {
        const response = createMockResponse()
        const mockData = []
        const query = 'SELECT * FROM users;'
        const params = []

        executeQuery.mockResolvedValue(mockData)

        const result = await executeQuerySendResponse(response, query, params)

        expect(executeQuery).toHaveBeenCalledWith(query, params)
        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith(mockData)
        expect(result).toBe(response)
    })

    it('returns 404 and [] if no row found on SELECT', async () => {
        const response = createMockResponse()
        const query = 'SELECT * FROM users WHERE id = ?;'
        const params = [9999]

        executeQuery.mockResolvedValue([])
        await executeQuerySendResponse(response, query, params)

        expect(response.status).toHaveBeenCalledWith(404)
        expect(response.json).toHaveBeenCalledWith([])
    })

    it('returns 201 and array with inserted row on INSERT', async () => {
        const response = createMockResponse()
        const insertResult = { insertId: 1 }
        const insertedRow = [{ id: 1, name: 'Michael', city: 'New York'}]
        const insertQuery = 'INSERT INTO users (name, city) VALUES (?, ?);'
        const selectQuery = 'SELECT * FROM users WHERE id = ?;'
        const insertParams = ['Michael', 'New York']

        executeQuery
            .mockResolvedValueOnce(insertResult)
            .mockResolvedValueOnce(insertedRow)
        await executeQuerySendResponse(response, insertQuery, insertParams)

        expect(executeQuery).toHaveBeenCalledWith(insertQuery, insertParams)
        expect(executeQuery)
            .toHaveBeenCalledWith(selectQuery, [insertResult.insertId])
        expect(response.status).toHaveBeenCalledWith(201)
        expect(response.json).toHaveBeenCalledWith(insertedRow)
    })

    it('returns 200 and array with updated row on UPDATE', async () => {
        const response = createMockResponse()
        const updateResult = { affectedRows: 1 }
        const updatedRow = [{ id: 1, name: 'Michael', city: 'New York' }]
        const updateQuery = 'UPDATE users SET name = ?, city = ? WHERE id = ?;'
        const selectQuery = 'SELECT * FROM users WHERE id = ?;'
        const updateParams = ['Michael', 'New York', 1]
        const selectParams = [1]

        executeQuery
            .mockResolvedValueOnce(updateResult)
            .mockResolvedValueOnce(updatedRow)
        await executeQuerySendResponse(response, updateQuery, updateParams)

        expect(executeQuery).toHaveBeenCalledWith(updateQuery, updateParams)
        expect(executeQuery).toHaveBeenCalledWith(selectQuery, selectParams)
        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith(updatedRow)
    })

    it('returns 404 and [error] for no affected rows on UPDATE', async () => {
        const response = createMockResponse()
        const query = 'UPDATE users SET name = ?, city = ? WHERE id = ?;'
        const params = ['Michael', 'New York', 9999]

        executeQuery.mockResolvedValue({ affectedRows: 0 })
        await executeQuerySendResponse(response, query, params)

        expect(executeQuery).toHaveBeenCalledWith(query, params)
        expect(response.status).toHaveBeenCalledWith(404)
        expect(response.json).toHaveBeenCalledWith([])
    })

    it('returns 400 and [error] for ER_BAD_NULL_ERROR', async () => {
        const response = createMockResponse()
        const query = 'INSERT INTO users (name, city) VALUES (?, ?);'
        const params = [null, 'New York']
        const columnNames = ['name', 'city']
        const error = new Error('Column \'name\' cannot be null')
        error.code = 'ER_BAD_NULL_ERROR'

        executeQuery.mockRejectedValue(error)
        await executeQuerySendResponse(response, query, params, columnNames)

        expect(executeQuery).toHaveBeenCalledWith(query, params)
        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith(['Name required'])
    })

    it('returns 422 and [error] for ER_DUP_ENTRY', async () => {
        const response = createMockResponse()
        const query = 'UPDATE users SET email = ? WHERE id = ?;'
        const params = ['michael.smith@example.com', 1]
        const columnNames = ['email']
        const error = new Error(
            'Duplicate entry \'michael.smith@example.com\' for key \'email\''
        )
        error.code = 'ER_DUP_ENTRY'

        executeQuery.mockRejectedValue(error)
        await executeQuerySendResponse(response, query, params, columnNames)

        expect(executeQuery).toHaveBeenCalledWith(query, params)
        expect(response.status).toHaveBeenCalledWith(422)
        expect(response.json).toHaveBeenCalledWith(['Email taken'])
    })

    it('returns 200 and [] for affected rows on DELETE', async () => {
        const response = createMockResponse()
        const query = 'DELETE FROM users WHERE id = ?;'
        const params = [1]

        executeQuery.mockResolvedValue({ affectedRows: 1 })
        await executeQuerySendResponse(response, query, params)

        expect(executeQuery).toHaveBeenCalledWith(query, params)
        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith([])
    })

    it('returns 404 and [error] for no affected rows on DELETE', async () => {
        const response = createMockResponse()
        const query = 'DELETE FROM users WHERE id = ?;'
        const params = [9999]

        executeQuery.mockResolvedValue({ affectedRows: 0 })
        await executeQuerySendResponse(response, query, params)

        expect(executeQuery).toHaveBeenCalledWith(query, params)
        expect(response.status).toHaveBeenCalledWith(404)
        expect(response.json).toHaveBeenCalledWith([])
    })

    it('returns 500 and [error] for unexpected error', async () => {
        const response = createMockResponse()
        const error = new Error('Unexpected error')

        executeQuery.mockRejectedValue(error)
        await executeQuerySendResponse(response, 'SELECT * FROM users;')

        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.json).toHaveBeenCalledWith(['Unexpected error'])
    })
})
