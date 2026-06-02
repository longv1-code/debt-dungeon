import bcrypt from 'bcryptjs'
import prisma from '../config/db.config'
import { signToken } from '../utils/jwt.utils'

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body

        // check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        })

        if (existingUser) {
            return res.status(400).json({ message: 'Email or username already tkane' })
        }

        // hash the password -- never store plain text
        const passwordHash = await bcrypt.hash(password, 10)

        // create user in database
        const user = await prisma.user.create({
            data: { email, username, passwordHash }
        })

        // sign a token
        const token = signToken({ id: user.id, username: user.username})

        res.status(201).json({
            token,
            user: { id: user.id, email: user.email, username: user.username }
        })
    } catch (err) {
        next(err)
    }
}

// @desc    Login existing user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        // find user by email
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        // Compare submitted password against stored hash
        const isMatch = await bcrypt.compare(password, user.passwordHash)

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const token = signToken({ id: user.id, uisername: user.username})

        res.status(200).json({
            token,
            user: { id: user.id, email: user.email, username: user.username }
        })
    } catch (err) {
        next(err)
    }
}