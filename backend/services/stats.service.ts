import prisma from '../config/db.config'
import { calculateMonthlyInterest, monthsUntilPaidOff } from './interest.service'

export const getUserStats = async (userId: number) => {
    // Fetch all debts with their payments
    const debts = await prisma.debt.findMany({
        where: { userId },
        include: { payments: true },
        orderBy: { createdAt: 'asc' }
    })

    // Total original debt
    const totalOriginalDebt = debts.reduce(
        (sum, debt) => sum + debt.originalAmount, 0
    )

    // Total remaining balance
    const totalCurrentBalance = debts.reduce(
        (sum, debt) => sum + debt.currentBalance, 0
    )

    // Total amount paid across all debts
    const totalPaid = debts.reduce((sum, debt) => {
        const debtPayments = debt.payments.reduce(
            (pSum, payment) => pSum + payment.amount, 0
        )
        return sum + debtPayments
    }, 0)

    // Defeated bosses (paid off debts)
    const defeatedBosses = debts.filter(debt => debt.currentBalance === 0).length
    const activeBosses = debts.filter(debt => debt.currentBalance > 0).length

    // Monthly interest across all active debts
    const monthlyInterestTotal = debts
        .filter(debt => debt.currentBalance > 0)
        .reduce((sum, debt) => {
            return sum + calculateMonthlyInterest(debt.currentBalance, debt.interestRate)
        }, 0)
    
    // Per-debt breakdown for the donut chart
    const debtBreakdown = debts.map(debt => ({
        id: debt.id,
        name: debt.name,
        type: debt.type,
        currentBalance: debt.currentBalance,
        originalAmount: debt.originalAmount,
        percentageOfTotal: totalCurrentBalance > 0
            ? parseFloat(((debt.currentBalance / totalCurrentBalance) * 100).toFixed(1))
            : 0,
        hpPercentage: parseFloat(
            ((debt.currentBalance / debt.originalAmount) * 100).toFixed(1)
        ),
        monthsUntilPaidOff: monthsUntilPaidOff(
            debt.currentBalance,
            debt.interestRate,
            debt.minimumPayment
        )
    }))

    // Payment history over time for the line chart
    const allPayments = debts
        .flatMap(debt => 
            debt.payments.map(payment => ({
                ...payment,
                debtName: debt.name
            }))
        )
        .sort((a, b) => new Date(a.paidAt).getTime() - new Date(b.paidAt). getTime())

    return {
        totalOriginalDebt: parseFloat(totalOriginalDebt.toFixed(2)),
        totalCurrentBalance: parseFloat(totalCurrentBalance.toFixed(2)),
        totalPaid: parseFloat(totalPaid.toFixed(2)),
        defeatedBosses,
        activeBosses,
        monthlyInterestTotal: parseFloat(monthlyInterestTotal.toFixed(2)),
        progressPercentage: totalOriginalDebt > 0 
            ? parseFloat(((totalPaid / totalOriginalDebt) * 100).toFixed(1))
            : 0,
        debtBreakdown,
        paymentHistory: allPayments
    }
}