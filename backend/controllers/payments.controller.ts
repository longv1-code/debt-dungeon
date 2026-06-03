import prisma from '../config/db.config'

// @desc    Get all payments for a debt
// @route   GET /api/debts/:id/payments
export const getPayments = async (req: any, res: any, next: any) => {
    try {
        const debt = await prisma.debt.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.user.id
            }
        })

        if (!debt) {
            return res.status(404).json({ message: 'Debt not found' })
        }

        const payments = await prisma.payment.findMany({
            where: { debtId: parseInt(req.params.id) },
            orderBy: { paidAt: 'desc' }
        })

        res.status(200).json(payments)
    } catch (err) {
        next(err)
    }
}

// @desc    Log a patment (deal damage to boss)
// @route   POST /api/debts/:id/payments
export const createPayment = async (req: any, res: any, next: any) => {
    try {
        const { amount, note } = req.body

        // Find the debt and verify ownership
        const debt = await prisma.debt.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.user.id
            }
        })

        if (!debt) {
            return res.status(404).json({ message: 'Debt not found' })
        }

        // Calculate new balance after payment
        const newBalance = Math.max(0, debt.currentBalance - amount)

        // Create the payment record
        const payment = await prisma.payment.create({
            data: {
                debtId: parseInt(req.params.id),
                amount,
                note
            }
        })

        // Update the debt's current balance
        const updateDebt = await prisma.debt.update({
            where: { id: parseInt(req.params.id) },
            data: { currentBalance: newBalance }
        })

        res.status(201).json({
            payment,
            debt: updateDebt,
            damage: amount,
            defeated: newBalance === 0
        })
    } catch (err) {
        next(err)
    }
}