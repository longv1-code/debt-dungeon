import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import { errorHandler } from './middleware/error.middleware'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' })
})

// handles error of all routes
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})