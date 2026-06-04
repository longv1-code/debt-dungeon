import { Router } from 'express'
import { body } from 'express-validator'
import { register, login } from '../controllers/auth.controller'
import { validate } from '../middleware/validate.middleware'

const router = Router()

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('username').notEmpty().withMessage('Username is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    validate,
    register
)

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validate,
    login
)

export default router