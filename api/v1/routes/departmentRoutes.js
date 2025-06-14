import express from 'express'
import departmentController from '../controllers/departmentController.js'

const departmentRouter = express.Router()

departmentRouter.get('/', departmentController.readDepartments)
departmentRouter.get('/:id', departmentController.readDepartment)
departmentRouter.post('/', departmentController.createDepartment)
departmentRouter.patch('/:id', departmentController.updateDepartment)
departmentRouter.delete('/:id', departmentController.deleteDepartment)

export default departmentRouter
