import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import request from 'supertest'
import express from 'express'
import employeeRouter from '../../routes/employeeRoutes.js'
import employeeController from '../../controllers/employeeController.js'

jest.mock('../../controllers/employeeController.js', () => ({
    readEmployees: jest.fn(),
    readEmployee: jest.fn(),
    createEmployee: jest.fn(),
    updateEmployee: jest.fn(),
    deleteEmployee: jest.fn()
}))

beforeEach(() => {
    employeeController.readEmployees.mockImplementation((request, response) => {
        response.status(200).json([
            { id: 1, last_name: 'Smith' },
            { id: 2, last_name: 'Jones' }
        ])
    })

    employeeController.readEmployee.mockImplementation((request, response) => {
        response.status(200).json({
            id: request.params.id,
            name: 'Smith'
        })
    })

    employeeController.createEmployee.mockImplementation(
        (request, response) => {
            response.status(201).json(request.body)
        }
    )

    employeeController.updateEmployee.mockImplementation(
        (request, response) => {
            response
                .status(200)
                .json(
                    Object.assign({}, { id: request.params.id }, request.body)
                )
        }
    )

    employeeController.deleteEmployee.mockImplementation(
        (request, response) => {
            response
                .status(200)
                .json({ message: 'Employee deleted successfully' })
        }
    )
})

describe('employeeRoutes', () => {
    let app

    beforeEach(() => {
        app = express()
        app.use(express.json())
        app.use('/api/v1/employees', employeeRouter)
    })
    afterEach(() => { jest.clearAllMocks() })

    it('handles GET /api/v1/employees', async () => {
        const response = await request(app).get('/api/v1/employees')
        expect(response.status).toBe(200)
    })

    it('handles GET /api/v1/employees/:id', async () => {
        const response = await request(app).get('/api/v1/employees/1')
        expect(response.status).toBe(200)
    })

    it('handles POST /api/v1/employees', async () => {
        const response = await request(app).post('/api/v1/employees').send({
            last_name: 'Smith'
        })
        expect(response.status).toBe(201)
    })

    it('handles PATCH /api/v1/employees/:id', async () => {
        const response = await request(app).patch('/api/v1/employees/1').send({
            last_name: 'Jones'
        })
        expect(response.status).toBe(200)
    })

    it('handles DELETE /api/v1/employees/:id', async () => {
        const response = await request(app).delete('/api/v1/employees/1')
        expect(response.status).toBe(200)
    })
})
