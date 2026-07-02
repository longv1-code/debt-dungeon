import prisma from '../config/db.config'

// Helper: resolve Clerk ID -> local numeric User.id
const getLocalUserId = async (clerkId: string) => {
  console.log('Looking up clerkId:', clerkId)
  const user = await prisma.user.findUnique({ where: { clerkId } })
  console.log('Found user:', user)
  if (!user) throw new Error('User not found in local database')
  return user.id
}

// @desc    Get all debts for logged in user
// @route   GET /api/debts
export const getDebts = async (req: any, res: any, next: any) => {
  try {
    const userId = await getLocalUserId(req.auth.userId)
    const debts = await prisma.debt.findMany({
      where: { userId },
      include: { payments: true }, // include debts with payment history
      orderBy: { createdAt: 'desc' }
    })
    res.status(200).json(debts)
  } catch (err) {
    next(err)
  }
}

// @desc    Get single debt
// @route   GET /api/debts/:id
export const getDebtById = async (req: any, res: any, next: any) => {
  try {
    const userId = await getLocalUserId(req.auth.userId)
    const debt = await prisma.debt.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId
      },
      include: { payments: true }
    })
    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' })
    }
    res.status(200).json(debt)
  } catch (err) {
    next(err)
  }
}

// @desc    Create a new debt
// @route   POST /api/debts
export const createDebt = async (req: any, res: any, next: any) => {
  try {
    const userId = await getLocalUserId(req.auth.userId)
    const {
      name,
      type,
      originalAmount,
      interestRate,
      minimumPayment
    } = req.body
    const debt = await prisma.debt.create({
      data: {
        userId,
        name,
        type,
        originalAmount,
        currentBalance: originalAmount,
        interestRate,
        minimumPayment
      }
    })
    res.status(201).json(debt)
  } catch (err) {
    next(err)
  }
}

// @desc    Update a debt
// @route   PATCH /api/debts/:id
export const updateDebt = async (req: any, res: any, next: any) => {
  try {
    const userId = await getLocalUserId(req.auth.userId)
    const debt = await prisma.debt.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId
      }
    })
    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' })
    }

    const updated = await prisma.debt.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    })
    res.status(200).json(updated)
  } catch (err) {
    next(err)
  }
}

// @desc    Delete a debt
// @route   DELETE /api/debts/:id
export const deleteDebt = async (req: any, res: any, next: any) => {
  try {
    const userId = await getLocalUserId(req.auth.userId)
    const debt = await prisma.debt.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId
       }
    })
    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' })
    }
    // Delete payments first -- they depend on the debt existing
    await prisma.payment.deleteMany({
      where: { debtId: parseInt(req.params.id) }
    })
    await prisma.debt.delete({
      where: { id: parseInt(req.params.id) }
    })
    res.status(200).json({ message: 'Debt deleted' })
  } catch (err) {
    next(err)
  }
}