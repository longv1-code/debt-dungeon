import { Router } from 'express'
import { getStats } from '../controllers/stats.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()

router.use(protect)

router.get('/', getStats)

export default router