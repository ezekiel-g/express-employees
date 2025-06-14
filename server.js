import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import departmentRoutes from './api/v1/routes/departmentRoutes.js'
import employeeRoutes from './api/v1/routes/employeeRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const corsOptions = {
    origin: process.env.FRONT_END_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}

app.use(express.json())
app.use(cors(corsOptions))

app.use('/api/v1/departments', departmentRoutes)
app.use('/api/v1/employees', employeeRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
