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

describe('Department Router', () => {
    let app

    beforeEach(() => {
        app = express()
        app.use(express.json())
        app.use('/api/departments', departmentRoutes)
    })
    afterEach(() => { jest.clearAllMocks() })

    it('handles GET /api/departments', async () => {
        const response = await request(app).get('/api/departments')
        expect(response.status).toBe(200)
    })

    it('handles GET /api/departments/:id', async () => {
        const response = await request(app).get('/api/departments/1')
        expect(response.status).toBe(200)
    })

    it('handles POST /api/departments', async () => {
        const response =
            await request(app).post('/api/departments').send({ name: 'IT' })
        expect(response.status).toBe(201)
    })

    it('handles PATCH /api/departments/:id', async () => {
        const response =
            await request(app).patch('/api/departments/1').send({ name: 'HR' })
        expect(response.status).toBe(200)
    })

    it('handles DELETE /api/departments/:id', async () => {
        const response = await request(app).delete('/api/departments/1')
        expect(response.status).toBe(200)
    })
})
