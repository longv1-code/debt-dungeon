import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import debtRoutes from './routes/debts.routes'
import statsRoutes from './routes/stats.routes'
import webhooksRouter from './routes/webhooks.routes'
import stripeRouter from './routes/stripe.routes'
import userRouter from './routes/user.routes'
import stripeWebhookRouter from './routes/stripeWebhook.routes'
import { errorHandler } from './middleware/error.middleware'
import { clerkAuth } from './middleware/auth.middleware'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use('/webhooks', webhooksRouter)
app.use('/api/stripe/webhook', stripeWebhookRouter)

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://debt-dungeon.vercel.app'],
    credentials: true,
}))

app.use(express.json())
app.use(clerkAuth)

// Routes
app.use('/api/debts', debtRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/user', userRouter)
app.use('/api/stripe', stripeRouter)

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