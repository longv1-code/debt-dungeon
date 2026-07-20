import express from 'express'
import Stripe from 'stripe'
import prisma from '../config/db.config'

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

router.post('/', express.raw({ type: 'application/json' }), async (req: any, res: any) => {
    const sig = req.headers['stripe-signature']
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
        )
    } catch (err) {
        console.error('Stripe webhook signature failed:', err)
        return res.status(400).json({ message: 'Invalid webhook signature' })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.payment_status === 'paid') {
        const clerkId = session.metadata?.clerkId
        if (!clerkId) {
            console.error('Missing clerkId in Stripe session metadata')
            return res.status(400).json({ message: 'Missing clerkId in metadata' })
        }
        await prisma.user.update({
            where: { clerkId },
            data: { tier: 'KNIGHT' }
        })
        console.log(`User ${clerkId} upgraded to KNIGHT`)
        }
    }

    res.status(200).json({ received: true })
})

export default router