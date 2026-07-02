import prisma from '../config/db.config'
import { getUserStats } from '../services/stats.service'

// Helper: resolve Clerk ID -> local numeric User.id
const getLocalUserId = async (clerkId: string) => {
    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) throw new Error('User not found in local database')
    return user.id
}

// @desc    Get aggregated stats
// @route   GET /api/statser
export const getStats = async (req: any, res: any, next: any) => {
    try {
        const userId = await getLocalUserId(req.auth.userId)
        const stats = await getUserStats(userId)
        res.status(200).json(stats)
    } catch (err) {
        next(err)
    }
}