import express from 'express'
import prisma from '../config/db.config'
import { protect } from '../middleware/auth.middleware'

const router = express.Router()

// @desc    Get current user profile (including tier)
// @route   GET /api/user/me
router.get('/me', protect, async (req: any, res: any) => {
    try {
        const clerkId = req.auth.userId
        const user = await prisma.user.findUnique({
            where: { clerkId: clerkId as string },
            select: { id: true, username: true, email: true, tier: true, createdAt: true }
        })
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.status(200).json(user)
    } catch (err) {
        console.error('user/me error:', err)
        res.status(500).json({ message: 'Failed to fetch user' })
    }
})

export default router