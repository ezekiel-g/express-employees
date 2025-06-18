import { describe, it, expect, beforeEach, afterEach, jest }
    from '@jest/globals'
import request from 'supertest'
import express from 'express'
import departmentRoutes from '../../routes/departmentRoutes.js'
import departmentController from '../../controllers/departmentController.js'

jest.mock('../../controllers/departmentController.js', () => ({
    readDepartments: jest.fn(),
    readDepartment: jest.fn(),
    createDepartment: jest.fn(),
    updateDepartment: jest.fn(),
    deleteDepartment: jest.fn()
}))

beforeEach(() => {
    departmentController.readDepartments.mockImplementation(
        (request, response) => {
            response.status(200).json([{ id: 1, name: 'IT' }])
        }
    )

    departmentController.readDepartment.mockImplementation(
        (request, response) => {
            response.status(200).json({ id: request.params.id, name: 'IT' })
        }
    )

    departmentController.createDepartment.mockImplementation(
        (request, response) => {
            response.status(201).json(request.body)
        }
    )

    departmentController.updateDepartment.mockImplementation(
        (request, response) => {
            response
                .status(200)
                .json(
                    Object.assign({}, { id: request.params.id }, request.body)
                )
        }
    )

    departmentController.deleteDepartment.mockImplementation(
        (request, response) => {
            response.status(200).json({ message: 'Deleted successfully' })
        }
    )
})

describe('departmentRoutes', () => {
    let app

    beforeEach(() => {
        app = express()
        app.use(express.json())
        app.use('/api/v1/departments', departmentRoutes)
    })
    afterEach(() => { jest.clearAllMocks() })

    it('handles GET /api/v1/departments', async () => {
        const response = await request(app).get('/api/v1/departments')
        expect(response.status).toBe(200)
    })

    it('handles GET /api/v1/departments/:id', async () => {
        const response = await request(app).get('/api/v1/departments/1')
        expect(response.status).toBe(200)
    })

    it('handles POST /api/v1/departments', async () => {
        const response =
            await request(app).post('/api/v1/departments').send({ name: 'IT' })
        expect(response.status).toBe(201)
    })

    it('handles PATCH /api/v1/departments/:id', async () => {
        const response =
            await request(app)
                .patch('/api/v1/departments/1').send({ name: 'HR' })
        expect(response.status).toBe(200)
    })

    it('handles DELETE /api/v1/departments/:id', async () => {
        const response = await request(app).delete('/api/v1/departments/1')
        expect(response.status).toBe(200)
    })
})
