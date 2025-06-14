import dbConnection from '../db/dbConnection.js'
import validateEmployee from '../util/validateEmployee.js'

const readEmployees = async (request, response) => {
    await dbConnection.executeQuerySendResponse(
        response,
        'SELECT',
        'SELECT * FROM employees;'
    )
}

const readEmployee = async (request, response) => {
    await dbConnection.executeQuerySendResponse(
        response,
        'SELECT',
        'SELECT * FROM employees WHERE id = ?;',
        [request.params.id]
    )
}

const createEmployee = async (request, response) => {
    const validationResult = await validateEmployee(request, response)

    if (!validationResult.valid) return

    await dbConnection.executeQuerySendResponse(
        response,
        'INSERT',
        `INSERT INTO employees (
            first_name,
            last_name,
            title,
            department_id,
            email,
            country_code,
            phone_number,
            is_active,
            hire_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        validationResult.queryParams
    )
}

const updateEmployee = async (request, response) => {
    const validationResult = await validateEmployee(
        request,
        response,
        request.params.id
    )

    if (!validationResult.valid) return

    await dbConnection.executeQuerySendResponse(
        response,
        'UPDATE',
        `UPDATE employees
        SET ${validationResult.queryFields.join(', ')}
        WHERE id = ?;`,
        validationResult.queryParams,
        validationResult.successfulUpdates
    )    
}

const deleteEmployee = async (request, response) => {
    await dbConnection.executeQuerySendResponse(
        response,
        'DELETE',
        'DELETE FROM employees WHERE id = ?;',
        [request.params.id]
    )     
}

export default {
    readEmployees,
    readEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
}
