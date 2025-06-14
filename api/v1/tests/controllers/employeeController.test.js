import { describe, it, expect, beforeEach, afterEach, jest }
    from '@jest/globals'
import employeeController from '../../controllers/employeeController.js'
import dbConnection from '../../db/dbConnection.js'
import validateEmployee from '../../util/validateEmployee.js'

jest.mock('../../db/dbConnection.js')
jest.mock('../../util/validateEmployee.js')

describe('employeeController', () => {
    let request
    let response

    beforeEach(() => {
        request = {}
        response = { send: jest.fn(), status: jest.fn().mockReturnThis() }
    })
    afterEach(() => { jest.clearAllMocks() })

    it('sends all employee data using readEmployees', async () => {
        dbConnection.executeQuerySendResponse.mockResolvedValueOnce({
            rows: [
                { id: 1, last_name: 'Smith' },
                { id: 2, last_name: 'Jones' }
            ]
        })
        await employeeController.readEmployees(request, response)
        expect(dbConnection.executeQuerySendResponse).toHaveBeenCalledWith(
            response,
            'SELECT',
            expect.stringContaining('SELECT * FROM')
        )
    })

    it('sends specific employee data using readEmployee', async () => {
        request.params = { id: 1 }

        dbConnection.executeQuerySendResponse
            .mockResolvedValueOnce({ rows: [{ id: 1, last_name: 'Smith' }] })
        await employeeController.readEmployee(request, response)
        expect(dbConnection.executeQuerySendResponse).toHaveBeenCalledWith(
            response,
            'SELECT',
            expect.stringContaining('SELECT * FROM'),
            [1]
        )
    })

    it('creates a new employee using createEmployee', async () => {
        request.body = { firstName: 'Michael', lastName: 'Smith' }

        validateEmployee.mockResolvedValueOnce({
            valid: true,
            queryParams: ['Michael', 'Smith']
        })
        dbConnection.executeQuerySendResponse.mockResolvedValueOnce({})
        await employeeController.createEmployee(request, response)
        expect(dbConnection.executeQuerySendResponse).toHaveBeenCalledWith(
            response,
            'INSERT',
            expect.stringContaining('INSERT INTO'),
            ['Michael', 'Smith']
        )
    })

    it('exits early from createEmployee when validation fails', async () => {
        request.body = { firstName: '', lastName: 'Smith' }
        
        validateEmployee.mockResolvedValueOnce({
            valid: false, validationErrors: ['First name required']
        })
        await employeeController.createEmployee(request, response)
        expect(validateEmployee).toHaveBeenCalledWith(request, response)
        expect(dbConnection.executeQuerySendResponse).not.toHaveBeenCalled()
    })

    it('updates an employee using updateEmployee', async () => {
        request.params = { id: 1 }
        request.body = { firstName: 'Michael', lastName: 'Smith' }

        validateEmployee.mockResolvedValueOnce({
            valid: true,
            queryFields: ['first_name = ?', 'last_name = ?'],
            queryParams: ['Michael', 'Smith', 1],
            successfulUpdates: ['Success message 1', 'Success message 2']
        })
        dbConnection.executeQuerySendResponse.mockResolvedValueOnce({})
        await employeeController.updateEmployee(request, response)
        expect(dbConnection.executeQuerySendResponse).toHaveBeenCalledWith(
            response,
            'UPDATE',
            expect.stringContaining('UPDATE'),
            ['Michael', 'Smith', 1],
            ['Success message 1', 'Success message 2']
        )
    })

    it('exits early from updateEmployee when validation fails', async () => {
        request.params = { id: 1 }
        request.body = { firstName: '', lastName: 'Smith' }

        validateEmployee.mockResolvedValueOnce({
            valid: false, validationErrors: ['First name required']
        })
        await employeeController.updateEmployee(request, response)
        expect(validateEmployee).toHaveBeenCalledWith(request, response, 1)
        expect(dbConnection.executeQuerySendResponse).not.toHaveBeenCalled()
    })

    it('deletes an employee using deleteEmployee', async () => {
        request.params = { id: 1 }

        dbConnection.executeQuerySendResponse.mockResolvedValueOnce({})
        await employeeController.deleteEmployee(request, response)
        expect(dbConnection.executeQuerySendResponse).toHaveBeenCalledWith(
            response,
            'DELETE',
            expect.stringContaining('DELETE FROM'),
            [1]
        )
    })
})
