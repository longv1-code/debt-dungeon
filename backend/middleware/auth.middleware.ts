import { verifyToken } from '../utils/jwt.utils'

export const protect = (req, res, next) => { // checks every protected route
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = verifyToken(token)
        req.user = decoded
        next() // valid token, can access
    } catch (err) {
        return res.status(401).json({ message: 'Not authorized, invalid token '})
    }
}