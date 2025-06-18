import validationHelper from './validationHelper.js'

const validateFirstName = (input, currentValue = null) => {
    if (!input || input.trim() === '') {
        return { valid: false, message: 'First name required' }
    }

    if (!/^[A-Za-z'-\s]{1,100}$/.test(input)) {
        return {
            valid: false,
            message: 'First name can be maximum 100 characters and can ' +
                     'contain only letters, apostrophes, hyphens and ' +
                     'spaces between words'
        }
    }

    return validationHelper.returnSuccess('First name', input, currentValue)
}

const validateLastName = (input, currentValue = null) => {
    if (!input || input.trim() === '') {
        return { valid: false, message: 'Last name required' }
    }

    if (!/^[A-Za-z'-\s]{1,100}$/.test(input)) {
        return {
            valid: false,
            message: 'Last name can be maximum 100 characters and can ' +
                     'contain only letters, apostrophes, hyphens and ' +
                     'spaces between words'
        }
    }

    return validationHelper.returnSuccess('Last name', input, currentValue)
}

const validateTitle = (input, currentValue = null) => {
    if (!input || input.trim() === '') {
        return { valid: false, message: 'Job title required' }
    }

    if (!/^[A-Za-z'-\s]{1,100}$/.test(input)) {
        return {
            valid: false,
            message: 'Job title can be maximum 100 characters and can ' +
                     'contain only letters, apostrophes, hyphens and ' +
                     'spaces between words'
        }
    }

    return validationHelper.returnSuccess('Job title', input, currentValue)
}

const validateDepartmentId = async (input, currentValue = null) => {
    if (!input) {
        return { valid: false, message: 'Department required' }
    }
    
    if (!(Number.isInteger(input) && input > 0)) {
        return {
            valid: false,
            message: 'Department ID must be an integer greater than 0'
        }
    }
    
    const departments = await validationHelper.getDepartments()
    
    if (!departments.some(row => row.id === input)) {
        return { valid: false, message: 'Invalid department' }
    }
    
    return validationHelper.returnSuccess('Department', input, currentValue)
}

const validateEmail = async (
    input,
    currentValue = null,
    excludeId = null,
    skipDuplicateCheck = null
) => {
    if (!input || input.trim() === '') {
        return { valid: false, message: 'Email address required' }
    }
    
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(input)) {
        return {
            valid: false,
            message:
            'Email address must contain only letters, numbers, ' +
            'periods, underscores, hyphens, plus signs and percent ' +
            'signs before the "@", a domain name after the "@", and ' +
            'a valid domain extension (e.g. ".com", ".net", ".org") ' +
            'of at least two letters'
        }
    }
    
    if (!skipDuplicateCheck) {
        const duplicateCheck = await validationHelper.checkForDuplicate(
            { email: input },
            validationHelper.getEmployees,
            excludeId
        )
        
        if (duplicateCheck !== 'pass') {
            return { valid: false, message: 'Email address taken' }
        }
    }
    
    return validationHelper.returnSuccess('Email address', input, currentValue)
}

const validateCountryCode = (input, currentValue = null) => {
    if (!input || input.trim() === '') {
        return { valid: false, message: 'Country code required' }
    }

    if (!/^\d{1,4}$/.test(input)) {
        return {
            valid: false,
            message: 'Country code must be between 1 and 4 digits and ' +
                     'contain only digits'
        }
    }

    return validationHelper.returnSuccess('Country code', input, currentValue)
}

const validatePhoneNumber = (input, currentValue = null) => {
    if (!input || input.trim() === '') {
        return { valid: false, message: 'Phone number required' }
    }

    if (!/^\d{7,15}$/.test(input)) {
        return {
            valid: false,
            message: 'Phone number must be between 7 and 15 digits and ' +
                     'contain only digits'
        }
    }

    return validationHelper.returnSuccess('Phone number', input, currentValue)
}

const validateIsActive = (input, currentValue = null) => {
    if (input !== 0 && input !== 1) {
        return { valid: false, message: 'Active status must be 0 or 1' }
    }

    return validationHelper.returnSuccess('Active status', input, currentValue)
}

const validateHireDate = (input, currentValue = null) => {
    if (!input) {
        return { valid: false, message: 'Hire date required' }
    }
    
    if (currentValue && currentValue instanceof Date) {
        currentValue = currentValue.toISOString().split('T')[0]
    }
    
    return validationHelper.returnSuccess('Hire date', input, currentValue)
}

const validateEmployee = async (
    request,
    response,
    excludeId = null,
    skipDuplicateCheck = null
) => {
    const {
        firstName,
        lastName,
        title,
        email,
        countryCode,
        phoneNumber,
        isActive,
        departmentId,
        hireDate
    } = request.body
    const validationErrors = []
    const successfulUpdates = []
    const queryFields = []
    const queryParams = []
    let currentDetails = null

    if (excludeId) {
        excludeId = Number(excludeId)
        const employees = await validationHelper.getEmployees()
        currentDetails = employees.find(row => row.id === excludeId)
        
        if (
            currentDetails?.hire_date &&
            typeof currentDetails.hire_date === 'object'
        ) {
            currentDetails.hire_date = currentDetails.hire_date.toISOString()
            currentDetails.hire_date = currentDetails.hire_date.split('T')[0]
        }
    }
    
    const firstNameValid =
        validateFirstName(firstName, currentDetails?.first_name)

    if (!firstNameValid.valid) {
        validationErrors.push(firstNameValid.message)
    } else {
        if (excludeId) {
            if (
                firstNameValid.message &&
                firstName !== currentDetails.first_name
            ) {
                successfulUpdates.push(firstNameValid.message)
                queryFields.push('first_name = ?')
                queryParams.push(firstName)
            }
        } else {
            queryFields.push('first_name = ?')
            queryParams.push(firstName)            
        }
    }

    const lastNameValid = validateLastName(lastName, currentDetails?.last_name)

    if (!lastNameValid.valid) {
        validationErrors.push(lastNameValid.message)
    } else {
        if (excludeId) {
            if (
                lastNameValid.message &&
                lastName !== currentDetails.last_name
            ) {
                successfulUpdates.push(lastNameValid.message)
                queryFields.push('last_name = ?')
                queryParams.push(lastName)
            }
        } else {
            queryFields.push('last_name = ?')
            queryParams.push(lastName)
        }
    }

    const titleValid = validateTitle(title, currentDetails?.title)

    if (!titleValid.valid) {
        validationErrors.push(titleValid.message)
    } else {
        if (excludeId) {
            if (titleValid.message && title !== currentDetails.title) {
                successfulUpdates.push(titleValid.message)
                queryFields.push('title = ?')
                queryParams.push(title)
            }
        } else {
            queryFields.push('title = ?')
            queryParams.push(title)            
        }
    }

    const departmentIdValid =
        await validateDepartmentId(departmentId, currentDetails?.department_id)

    if (!departmentIdValid.valid) {
        validationErrors.push(departmentIdValid.message)
    } else {
        if (excludeId) {
            if (
                departmentIdValid.message &&
                departmentId !== currentDetails.department_id
            ) {
                successfulUpdates.push(departmentIdValid.message)
                queryFields.push('department_id = ?')
                queryParams.push(departmentId)
            }
        } else {
            queryFields.push('department_id = ?')
            queryParams.push(departmentId)            
        }
    }

    const emailValid = await validateEmail(
        email,
        currentDetails?.email,
        excludeId,
        skipDuplicateCheck
    )

    if (!emailValid.valid) {
        validationErrors.push(emailValid.message)
    } else {
        if (excludeId) {
            if (emailValid.message && email !== currentDetails.email) {
                successfulUpdates.push(emailValid.message)
                queryFields.push('email = ?')
                queryParams.push(email)
            }
        } else {
            queryFields.push('email = ?')
            queryParams.push(email)
        }
    }

    const countryCodeValid =
        validateCountryCode(countryCode, currentDetails?.country_code)

    if (!countryCodeValid.valid) {
        validationErrors.push(countryCodeValid.message)
    } else {
        if (excludeId) {
            if (
                countryCodeValid.message &&
                countryCode !== currentDetails.country_code
            ) {
                successfulUpdates.push(countryCodeValid.message)
                queryFields.push('country_code = ?')
                queryParams.push(countryCode)
            }
        } else {
            queryFields.push('country_code = ?')
            queryParams.push(countryCode)
        }
    }

    const phoneNumberValid =
        validatePhoneNumber(phoneNumber, currentDetails?.phone_number)

    if (!phoneNumberValid.valid) {
        validationErrors.push(phoneNumberValid.message)
    } else {
        if (excludeId) {
            if (
                phoneNumberValid.message &&
                phoneNumber !== currentDetails.phone_number
            ) {
                successfulUpdates.push(phoneNumberValid.message)
                queryFields.push('phone_number = ?')
                queryParams.push(phoneNumber)
            }
        } else {
            queryFields.push('phone_number = ?')
            queryParams.push(phoneNumber)
        }
    }    

    const isActiveValid = validateIsActive(isActive, currentDetails?.is_active)

    if (!isActiveValid.valid) {
        validationErrors.push(isActiveValid.message)
    } else {
        if (excludeId) {
            if (
                isActiveValid.message &&
                isActive !== currentDetails.is_active
            ) {
                successfulUpdates.push(isActiveValid.message)
                queryFields.push('is_active = ?')
                queryParams.push(isActive)
            }
        } else {
            queryFields.push('is_active = ?')
            queryParams.push(isActive)
        }
    }

    const hireDateValid = validateHireDate(hireDate, currentDetails?.hire_date)

    if (!hireDateValid.valid) {
        validationErrors.push(hireDateValid.message)
    } else {
        if (excludeId) {
            if (
                hireDateValid.message &&
                hireDate !== currentDetails.hire_date
            ) {
                successfulUpdates.push(hireDateValid.message)
                queryFields.push('hire_date = ?')
                queryParams.push(hireDate)
            }
        } else {
            queryFields.push('hire_date = ?')
            queryParams.push(hireDate)
        }
    }
    
    if (
        excludeId &&
        validationErrors.length === 0 &&
        successfulUpdates.length === 0
    ) {
        validationErrors.push('No changes detected')
    }

    if (validationErrors.length > 0) {
        return response.status(400).json({
            message: 'Validation failed',
            validationErrors
        })
    }

    if (excludeId) queryParams.push(excludeId)

    return { valid: true, successfulUpdates, queryFields, queryParams }     
}

export default validateEmployee
