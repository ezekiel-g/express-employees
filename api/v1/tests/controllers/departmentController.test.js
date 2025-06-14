import { describe, it, expect, beforeEach, afterEach, jest }
    from '@jest/globals'
import departmentController from '../../controllers/departmentController.js'
import dbConnection from '../../db/dbConnection.js'
import validateDepartment from '../../util/validateDepartment.js'

jest.mock('../../db/dbConnection.js')
jest.mock('../../util/validateDepartment.js')

describe('departmentController', () => {
    let request
    let response

    beforeEach(() => {
        request = {}
        response = { send: jest.fn(), status: jest.fn().mockReturnThis() }
    })
    afterEach(() => { jest.clearAllMocks() })

    it('sends all department data using readDepartments', async () => {
        dbConnection.executeQuerySendResponse.mockResolvedValueOnce({
            rows: [
                { id: 1, name: 'IT' },
                { id: 2, name: 'HR' }
            ]
        })
        await departmentController.readDepartments(request, response)
        expect(dbConnection.executeQuerySendResponse).toHaveBeenCalledWith(
            response,
            'SELECT',
            expect.stringContaining('SELECT * FROM')
        )
    })

    it('sends specific department data using readDepartment', async () => {
        request.params = { id: 1 }

        dbConnection.executeQuerySendResponse
            .mockResolvedValueOnce({ rows: [{ id: 1, name: 'IT' }] })
        await departmentController.readDepartment(request, response)
        expect(dbConnection.executeQuerySendResponse).toHaveBeenCalledWith(
            response,
            'SELECT',
            expect.stringContaining('SELECT * FROM'),
            [1]
        )
    })

    it('creates a new department using createDepartment', async () => {
        request.body = { name: 'IT', code: 'IT1', location: 'New York' }

        validateDepartment.mockResolvedValueOnce({
            valid: true,
            queryParams: ['IT', 'IT1', 'New York']
        })
        dbConnection.executeQuerySendResponse.mockResolvedValueOnce({})
        await departmentController.createDepartment(request, response)
        expect(dbConnection.executeQuerySendResponse).toHaveBeenCalledWith(
            response,
            'INSERT',
            expect.stringContaining('INSERT INTO'),
            ['IT', 'IT1', 'New York']
        )
    })

    it('exits early from createDepartment when validation fails', async () => {
        request.body = { name: '', code: 'IT1', location: 'New York' }
        
        validateDepartment.mockResolvedValueOnce({
            valid: false, validationErrors: ['Name required']
        })
        await departmentController.createDepartment(request, response)
        expect(validateDepartment).toHaveBeenCalledWith(request, response)
        expect(dbConnection.executeQuerySendResponse).not.toHaveBeenCalled()
    })

    it('updates a department using updateDepartment', async () => {
        request.params = { id: 1 }
        request.body = { name: 'IT', location: 'New York' }

        validateDepartment.mockResolvedValueOnce({
            valid: true,
            queryFields: ['name = ?', 'location = ?'],
            queryParams: ['IT', 'New York', 1],
            successfulUpdates: ['Success message 1', 'Success message 2']
        })
        dbConnection.executeQuerySendResponse.mockResolvedValueOnce({})
        await departmentController.updateDepartment(request, response)
        expect(dbConnection.executeQuerySendResponse).toHaveBeenCalledWith(
            response,
            'UPDATE',
            expect.stringContaining('UPDATE'),
            ['IT', 'New York', 1],
            ['Success message 1', 'Success message 2']
        )
    })

    it('exits early from updateDepartment when validation fails', async () => {
        request.params = { id: 1 }
        request.body = { name: '', location: 'New York' }

        validateDepartment.mockResolvedValueOnce({
            valid: false, validationErrors: ['Name required']
        })
        await departmentController.updateDepartment(request, response)
        expect(validateDepartment).toHaveBeenCalledWith(request, response, 1)
        expect(dbConnection.executeQuerySendResponse).not.toHaveBeenCalled()
    })

    it('deletes a department using deleteDepartment', async () => {
        request.params = { id: 1 }

        dbConnection.executeQuerySendResponse.mockResolvedValueOnce({})
        await departmentController.deleteDepartment(request, response)
        expect(dbConnection.executeQuerySendResponse).toHaveBeenCalledWith(
            response,
            'DELETE',
            expect.stringContaining('DELETE FROM'),
            [1]
        )
    })
})
