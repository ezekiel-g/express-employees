import express from 'express'
import employeeController from '../controllers/employeeController.js'

const employeeRouter = express.Router()

employeeRouter.get('/', employeeController.readEmployees)
employeeRouter.get('/:id', employeeController.readEmployee)
employeeRouter.post('/', employeeController.createEmployee)
employeeRouter.patch('/:id', employeeController.updateEmployee)
employeeRouter.delete('/:id', employeeController.deleteEmployee)

export default employeeRouter
