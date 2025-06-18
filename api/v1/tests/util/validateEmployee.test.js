import { describe, it, expect, beforeEach, afterEach, jest }
    from '@jest/globals'
import validateEmployee from '../../util/validateEmployee.js'
import validationHelper from '../../util/validationHelper.js'

jest.mock('../../util/validationHelper.js')

describe('validateEmployee', () => {
    const defaultRequestBody = {
        firstName: 'Michael',
        lastName: 'Smith',
        title: 'IT Manager',
        departmentId: 1,
        email: 'michael.smith@example.com',
        countryCode: '1',
        phoneNumber: '1234567890',
        isActive: 1,
        hireDate: '2022-01-30'          
    }
    const existingDepartments = [
        {
            id: 1,
            name: 'IT',
            code: 'IT1',
            location: 'New York'
        },
        {
            id: 2,
            name: 'HR',
            code: 'HR1',
            location: 'San Francisco'
        }
    ]
    const existingEmployees = [
        {
            id: 1,
            first_name: 'Michael',
            last_name: 'Smith',
            title: 'IT Manager',
            department_id: 1,
            email: 'michael.smith@example.com',
            country_code: '1',
            phone_number: '1234567890',
            is_active: 1,
            hire_date: new Date('2022-01-30T00:00:00Z')
        },
        { 
            id: 2,
            first_name: 'Amber',
            last_name: 'Jones',
            title: 'HR Manager',
            department_id: 2,
            email: 'amber.jones@example.com',
            country_code: '1',
            phone_number: '0987654321',
            is_active: 1,
            hire_date: new Date('2023-06-20T00:00:00Z')
        }
    ]
    const message = 'Validation failed'
    let request
    let response

    beforeEach(() => {
        request = { body: Object.assign({}, defaultRequestBody) }
        response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        validationHelper.checkForDuplicate.mockResolvedValue('pass')
        validationHelper.returnSuccess
            .mockReturnValue({ valid: true, message: '' })
        jest.spyOn(validationHelper, 'getEmployees')
            .mockResolvedValue(existingEmployees)
        jest.spyOn(validationHelper, 'getDepartments')
            .mockResolvedValue(existingDepartments)
    })
    afterEach(() => { jest.clearAllMocks() })

    it('returns validation error for empty first name', async () => {
        request.body.firstName = ''

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['First name required']
        })
    })

    it('returns validation error for invalid first name format', async () => {
        request.body.firstName = 'Michael&'

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors:
                expect.arrayContaining([expect.stringContaining('can be')])
        })
    })

    it('returns validation error for empty last name', async () => {
        request.body.lastName = ''

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['Last name required']
        })
    })

    it('returns validation error for invalid last name format', async () => {
        request.body.lastName = 'Smith&'

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors:
                expect.arrayContaining([expect.stringContaining('can be')])
        })
    })

    it('returns validation error for empty title', async () => {
        request.body.title = ''

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['Job title required']
        })
    })

    it('returns validation error for invalid title format', async () => {
        request.body.title = 'IT Manager&'

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors:
                expect.arrayContaining([expect.stringContaining('can be')])
        })
    })

    it('returns validation error for empty email', async () => {
        request.body.email = ''

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['Email address required']
        })
    })

    it('returns validation error for invalid email format', async () => {
        request.body.email = 'michael.smith&example.com'

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors:
                expect.arrayContaining([expect.stringContaining('must')])
        })
    })

    it('returns validation error for duplicate email', async () => {
        validationHelper.checkForDuplicate.mockResolvedValue('fail')
        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['Email address taken']
        })
    })

    it('returns validation error for empty hire date', async () => {
        request.body.hireDate = ''

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['Hire date required']
        })
    })

    it('returns validation error for empty department ID', async () => {
        request.body.departmentId = ''

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['Department required']
        })
    })

    it(
        'returns validation error for invalid department ID format'
        , async () => {
            request.body.departmentId = 'Invalid value'

            await validateEmployee(request, response, 1)
            expect(response.json).toHaveBeenCalledWith({
                message,
                validationErrors:
                    expect.arrayContaining([expect.stringContaining('must be')])
            })
        })

    it('returns validation error for non-existing department', async () => {
        request.body.departmentId = 999
        await validateEmployee(request, response, 1)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors:
                expect.arrayContaining([expect.stringContaining('Invalid')])
        })
    })

    it('returns validation error for empty country code', async () => {
        request.body.countryCode = ''

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['Country code required']
        })
    })

    it('returns validation error for invalid country code format', async () => {
        request.body.countryCode = '99999'

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors:
                expect.arrayContaining([expect.stringContaining('must be')])
        })
    })

    it('returns validation error for empty phone number', async () => {
        request.body.phoneNumber = ''

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['Phone number required']
        })
    })

    it('returns validation error for invalid phone number format', async () => {
        request.body.phoneNumber = '99999'

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors:
                expect.arrayContaining([expect.stringContaining('must be')])
        })
    })

    it('returns validation error for active status not 0 or 1', async () => {
        request.body.isActive = 'Invalid value'

        await validateEmployee(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['Active status must be 0 or 1']
        })
    })

    it('returns error when no changes are detected', async () => {
        await validateEmployee(request, response, 1)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['No changes detected']
        })
    })

    it('returns { valid: true } if no validation errors', async () => {
        const validationResult = await validateEmployee(request, response)

        expect(validationResult.valid).toBe(true)
    })
})
