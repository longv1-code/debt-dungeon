import { clerkMiddleware, getAuth } from '@clerk/express'

export const clerkAuth = clerkMiddleware()

export const protect = (req: any, res: any, next: any) => {
    const auth = getAuth(req)
    console.log('protect auth:', auth)
    if (!auth.userId) {
        return res.status(401).json({ message: 'Not authorized, no valid session' })
    }
    req.auth = auth
    next()
}