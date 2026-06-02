import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET

export const signToken = (payload) => { // signed string to prove who they are, no session storage needed
    return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token) => { // verifies token for their requests
    return jwt.verify(token, SECRET)
}