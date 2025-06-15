import { describe, it, expect, beforeEach, afterEach, jest }
    from '@jest/globals'
import validateDepartment from '../../util/validateDepartment.js'
import validationHelper from '../../util/validationHelper.js'

jest.mock('../../util/validationHelper.js')

describe('validateDepartment', () => {
    const defaultRequestBody = { name: 'IT', code: 'IT1', location: 'New York' }
    const existingDepartments = [
        { id: 1, name: 'IT', code: 'IT1', location: 'New York' },
        { id: 2, name: 'HR', code: 'HR1', location: 'San Francisco' }
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
        jest.spyOn(validationHelper, 'getDepartments')
            .mockResolvedValue(existingDepartments)
    })
    afterEach(() => { jest.clearAllMocks() })

    it('returns validation error for empty name', async () => {
        request.body.name = ''

        await validateDepartment(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['Name required']
        })
    })

    it('returns validation error for invalid name format', async () => {
        request.body.name = 'Name&'

        await validateDepartment(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors:
                expect.arrayContaining([expect.stringContaining('can be')])
        })
    })

    it('returns validation error for empty code', async () => {
        request.body.code = ''

        await validateDepartment(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['Code required']
        })
    })

    it('returns validation error for invalid code format', async () => {
        request.body.code = 'A&'

        await validateDepartment(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors:
                expect.arrayContaining([expect.stringContaining('can be')])
        })
    })

    it('returns validation error for duplicate code', async () => {
        validationHelper.checkForDuplicate.mockResolvedValue('fail')
        await validateDepartment(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['Code taken']
        })
    })

    it('returns validation error for empty location', async () => {
        request.body.location = ''

        await validateDepartment(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['Location required']
        })
    })

    it('returns validation error for invalid location', async () => {
        request.body.location = 'Chicago'

        await validateDepartment(request, response)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors:
                expect.arrayContaining([expect.stringContaining('Location no')])
        })
    })

    it('returns error when no changes are detected', async () => {
        await validateDepartment(request, response, 1)
        expect(response.json).toHaveBeenCalledWith({
            message,
            validationErrors: ['No changes detected']
        })
    })

    it('returns { valid: true } if no validation errors', async () => {
        const validationResult = await validateDepartment(request, response)

        expect(validationResult.valid).toBe(true)
    })
})
