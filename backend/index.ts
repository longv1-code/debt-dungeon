import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import debtRoutes from './routes/debts.routes'
import statsRoutes from './routes/stats.routes'
import webhooksRouter from './routes/webhooks.routes'
import { errorHandler } from './middleware/error.middleware'
import { clerkAuth } from './middleware/auth.middleware'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use('/webhooks', webhooksRouter)

// Middleware
app.use(cors())
app.use(express.json())
app.use(clerkAuth)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/debts', debtRoutes)
app.use('/api/stats', statsRoutes)

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