import { describe, it, expect, afterEach, jest } from '@jest/globals'
import dbConnection from '../../db/dbConnection.js'
import validationHelpers from '../../util/validationHelpers.js'

jest.mock('../../db/dbConnection.js', () => ({ executeQuery: jest.fn() }))

const sqlQueryFunction = jest.fn()

describe('validationHelpers', () => {
    afterEach(() => { jest.clearAllMocks() })

    describe('getDepartments', () => {
        it('fetches departments using dbConnection.executeQuery', async () => {
            const departments = [
                { id: 1, name: 'IT' },
                { id: 2, name: 'HR' }
            ]

            dbConnection.executeQuery.mockResolvedValueOnce(departments)

            const sqlResult = await validationHelpers.getDepartments()

            expect(sqlResult).toEqual(departments)
        })
    })
    
    describe('getEmployees', () => {
        it('fetches employees using dbConnection.executeQuery', async () => {
            const employees = [
                { id: 1, last_name: 'Smith' },
                { id: 2, last_name: 'Jones' }
            ]

            dbConnection.executeQuery.mockResolvedValueOnce(employees)

            const sqlResult = await validationHelpers.getEmployees()

            expect(sqlResult).toEqual(employees)
        })
    })

    describe('checkForDuplicate', () => {
        it('returns "pass" when no results returned from query', async () => {
            sqlQueryFunction.mockResolvedValueOnce([])

            const duplicateCheck = await validationHelpers.checkForDuplicate(
                { name: 'value1' },
                sqlQueryFunction
            )

            expect(duplicateCheck).toBe('pass')
        })

        it('returns "pass" when no duplicate is found', async () => {
            sqlQueryFunction.mockResolvedValueOnce([
                { id: 1, name: 'value2' },
                { id: 2, name: 'value3' }
            ])

            const duplicateCheck = await validationHelpers.checkForDuplicate(
                { name: 'value1' },
                sqlQueryFunction
            )

            expect(duplicateCheck).toBe('pass')
        })

        it('returns "fail" when a duplicate is found', async () => {
            sqlQueryFunction.mockResolvedValueOnce([
                { id: 1, name: 'value1' },
                { id: 2, name: 'value2' }
            ])

            const duplicateCheck = await validationHelpers.checkForDuplicate(
                { name: 'value1' },
                sqlQueryFunction
            )

            expect(duplicateCheck).toBe('fail')
        })

        it('excludes the ID when one is passed in', async () => {
            sqlQueryFunction.mockResolvedValueOnce([
                { id: 1, name: 'value1' },
                { id: 2, name: 'value2' }
            ])

            const duplicateCheck = await validationHelpers.checkForDuplicate(
                { name: 'value1' },
                sqlQueryFunction,
                1
            )

            expect(duplicateCheck).toBe('pass')
        })
    })

    describe('returnSuccess', () => {
        it('returns success message when current value is different', () => {
            const validationResult =
                validationHelpers.returnSuccess('Name', 'value1', 'value2')

            expect(validationResult).toEqual({
                valid: true,
                message: 'Name updated successfully'
            })
        })

        it('returns no message when current value is the same', () => {
            const validationResult =
                validationHelpers.returnSuccess('Name', 'value1', 'value1')

            expect(validationResult).toEqual({
                valid: true,
                message: null
            })
        })

        it('returns no message if current value is null', () => {
            const validationResult =
                validationHelpers.returnSuccess('Name', 'value1', null)

            expect(validationResult).toEqual({
                valid: true,
                message: null
            })
        })

        it('returns no message if current value is undefined', () => {
            const validationResult =
                validationHelpers.returnSuccess('Name', 'value1', undefined)

            expect(validationResult).toEqual({
                valid: true,
                message: null
            })
        })
    })
})
