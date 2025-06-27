import { describe, it, expect, beforeAll, afterAll, beforeEach, jest }
    from '@jest/globals'
import handleDbError from '../../util/handleDbError.js'

describe('handleDbError', () => {
    let response
    const columnNames = ['email', 'username', 'password']

    const runTest = (errorInput, expectedStatus, expectedMessage) => {
        handleDbError(response, errorInput, columnNames)

        expect(response.status).toHaveBeenCalledWith(expectedStatus)
        expect(response.json).toHaveBeenCalledWith([expectedMessage])
    }

    beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}))

    beforeEach(() => {
        response = {}
        response.status = jest.fn().mockReturnValue(response)
        response.json = jest.fn().mockReturnValue(response)
    })

    afterAll(() => console.error.mockRestore())

    it('returns 400 for missing default field', () => {
        runTest(
            { code: 'ER_NO_DEFAULT_FOR_FIELD', message: 'Value required' },
            400,
            'Required field(s) missing'
        )
    })

    it('returns 400 for undefined parameter error', () => {
        runTest(
            { message: 'parameters must not contain undefined' },
            400,
            'Required field(s) missing'
        )
    })

    it('returns 400 for ER_BAD_NULL_ERROR with email', () => {
        runTest(
            {
                code: 'ER_BAD_NULL_ERROR',
                message: 'Column \'email\' cannot be null'
            },
            400,
            'Email required'
        )
    })

    it('returns 400 for ER_DATA_TOO_LONG with username', () => {
        runTest(
            {
                code: 'ER_DATA_TOO_LONG',
                message: 'Data too long for column \'username\''
            },
            400,
            'Username too long'
        )
    })

    it('returns 400 for ER_CHECK_CONSTRAINT_VIOLATED with password', () => {
        runTest(
            {
                code: 'ER_CHECK_CONSTRAINT_VIOLATED',
                message: 'Check constraint failed for column \'password\''
            },
            400,
            'Password format invalid'
        )
    })

    it('returns 400 for ER_ILLEGAL_VALUE_FOR_TYPE with email', () => {
        runTest(
            {
                code: 'ER_ILLEGAL_VALUE_FOR_TYPE',
                message: 'Illegal value for column \'email\''
            },
            400,
            'Email format invalid'
        )
    })

    it('returns 400 for ER_WRONG_STRING_LENGTH with username', () => {
        runTest(
            {
                code: 'ER_WRONG_STRING_LENGTH',
                message: 'Wrong string length for column \'username\''
            },
            400,
            'Username format invalid'
        )
    })

    it('returns 400 for WARN_DATA_TRUNCATED with email', () => {
        runTest(
            {
                code: 'WARN_DATA_TRUNCATED',
                message: 'Truncated incorrect value for column \'email\''
            },
            400,
            'Email invalid'
        )
    })

    it('returns 422 for ER_DUP_ENTRY with username', () => {
        runTest(
            {
                code: 'ER_DUP_ENTRY',
                message: 'Duplicate entry for key \'username\''
            },
            422,
            'Username taken'
        )
    })

    it('returns 500 for unknown error code', () => {
        runTest(
            { code: 'UNKNOWN_CODE', message: 'Something went wrong' },
            500,
            'Unexpected error'
        )
    })

    it('returns 500 for missing error code and message', () => {
        runTest(
            { message: 'Something went wrong' },
            500,
            'Unexpected error'
        )
    })

    it('capitalizes column name in message', () => {
        runTest(
            {
                code: 'ER_BAD_NULL_ERROR',
                message: 'Column \'password\' cannot be null'
            },
            400,
            'Password required'
        )
    })
})
