const formatInsert = requestBody => {
    const columnNames = Object.keys(requestBody)
    const queryParams = columnNames.map(name => requestBody[name])
    const placeholders = columnNames.length
        ? '?, '.repeat(columnNames.length - 1) + '?'
        : ''

    return [columnNames, queryParams, placeholders]
}

const formatUpdate = (requestBody, id) => {
    const columnNames = Object.keys(requestBody).filter(name => name !== 'id')
    const queryParams = columnNames.map(name => requestBody[name])
    const setClause = columnNames.map(field => `${field} = ?`).join(', ')
    queryParams.push(id)

    return [columnNames, setClause, queryParams]
}

export { formatInsert, formatUpdate }
