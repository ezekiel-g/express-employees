import { describe, it, expect, afterEach, jest } from '@jest/globals'
import executeQuery from '../../util/executeQuery.js'
import dbConnection from '../../db/dbConnection.js'

jest.mock('../../db/dbConnection.js')

describe('executeQuery', () => {
    const mockResult = [{ id: 1, name: 'Michael', age: 30, city: 'New York'}]

    afterEach(() => jest.clearAllMocks())

    it('executes query with parameters and returns array', async () => {
        dbConnection.execute.mockResolvedValue([mockResult])

        const query = 'SELECT * FROM table WHERE id = ?;'
        const params = [1]
        const result = await executeQuery(query, params)

        expect(dbConnection.execute).toHaveBeenCalledWith(query, params)
        expect(result).toEqual(mockResult)
    })

    it('executes query without parameters and returns array', async () => {
        dbConnection.execute.mockResolvedValue([mockResult])

        const query = 'SELECT * FROM table;'
        const result = await executeQuery(query)

        expect(dbConnection.execute).toHaveBeenCalledWith(query, [])
        expect(result).toEqual(mockResult)
    })

    it('returns error message array on failure', async () => {
        const error = new Error('Error message')
        error.code = 'ER_CODE'

        dbConnection.execute.mockRejectedValue(error)

        const query = 'SELECT * FROM table;'
        const consoleSpy =
            jest.spyOn(console, 'error').mockImplementation(() => {})

        await expect(executeQuery(query)).rejects.toThrow('Error message')

        expect(consoleSpy).toHaveBeenCalledWith('Error ER_CODE: Error message')
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(String))

        consoleSpy.mockRestore()
    })
})
