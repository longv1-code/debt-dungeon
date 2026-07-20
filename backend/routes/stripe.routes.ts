import express from 'express'
import Stripe from 'stripe'
import prisma from '../config/db.config'
import { protect } from '../middleware/auth.middleware'

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

// @desc    Create a Stripe checkout session
// @route   POST /api/stripe/checkout
router.post('/checkout', protect, async (req: any, res: any) => {
    try {
        const clerkId = req.auth.userId
        const user = await prisma.user.findUnique({ where: { clerkId } })

        if (!user) return res.status(404).json({ message: 'User not found' })
        if (user.tier === 'KNIGHT') return res.status(400).json({ message: 'Already a Knight' })

        const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{ price: process.env.STRIPE_KNIGHT_PRICE_ID as string, quantity: 1 }],
        metadata: {
            userId: String(user.id),
            clerkId,
        },
        success_url: `${process.env.FRONTEND_URL}/dashboard?upgraded=true`,
        cancel_url: `${process.env.FRONTEND_URL}/pricing`,
        })

        res.status(200).json({ url: session.url })
    } catch (err) {
        console.error('Stripe checkout error:', err)
        res.status(500).json({ message: 'Failed to create checkout session' })
    }
})

export default router