import dbConnection from '../db/dbConnection.js'
import validateDepartment from '../util/validateDepartment.js'

const readDepartments = async (request, response) => {
    await dbConnection.executeQuerySendResponse(
        response,
        'SELECT',
        'SELECT * FROM departments;'
    )
}

const readDepartment = async (request, response) => {
    await dbConnection.executeQuerySendResponse(
        response,
        'SELECT',
        'SELECT * FROM departments WHERE id = ?;',
        [request.params.id]
    )
}

const createDepartment = async (request, response) => {
    const validationResult = await validateDepartment(request, response)
    
    if (!validationResult.valid) return
    
    await dbConnection.executeQuerySendResponse(
        response,
        'INSERT',
        'INSERT INTO departments (name, code, location) VALUES (?, ?, ?);',
        validationResult.queryParams
    )
}

const updateDepartment = async (request, response) => {
    const validationResult = await validateDepartment(
        request,
        response,
        request.params.id
    )

    if (!validationResult.valid) return

    await dbConnection.executeQuerySendResponse(
        response,
        'UPDATE',
        `UPDATE departments
        SET ${validationResult.queryFields.join(', ')}
        WHERE id = ?;`,
        validationResult.queryParams,
        validationResult.successfulUpdates
    )
}

const deleteDepartment = async (request, response) => {
    await dbConnection.executeQuerySendResponse(
        response,
        'DELETE',
        'DELETE FROM departments WHERE id = ?;',
        [request.params.id]
    ) 
}

export default {
    readDepartments,
    readDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
}
