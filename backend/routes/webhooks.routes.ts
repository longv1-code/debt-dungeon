import express from 'express'
import { Webhook } from 'svix'
import prisma from '../config/db.config'

const router = express.Router()

const getPrimaryEmail = (data: any) => data.email_addresses?.[0]?.email_address ?? null

const buildUsernameBase = (data: any, email: string | null) => {
  return data.username?.trim() || email?.split('@')[0] || data.id
}

const resolveUniqueUsername = async (preferredUsername: string, clerkId: string, currentUserId?: number) => {
  const preferred = preferredUsername.trim()
  const existingPreferred = await prisma.user.findUnique({ where: { username: preferred } })

  if (!existingPreferred || existingPreferred.id === currentUserId) {
    return preferred
  }

  const fallback = `${preferred}_${clerkId.slice(-6)}`
  const existingFallback = await prisma.user.findUnique({ where: { username: fallback } })

  if (!existingFallback || existingFallback.id === currentUserId) {
    return fallback
  }

  return `${preferred}_${clerkId.slice(-10)}`
}

const syncClerkUser = async (data: any) => {
  const clerkId = data.id
  const email = getPrimaryEmail(data)

  if (!email) {
    throw new Error('Clerk user is missing a primary email address')
  }

  const usernameBase = buildUsernameBase(data, email)

  const userByClerkId = await prisma.user.findUnique({ where: { clerkId } })
  if (userByClerkId) {
    const username = await resolveUniqueUsername(usernameBase, clerkId, userByClerkId.id)

    return prisma.user.update({
      where: { clerkId },
      data: {
        email,
        username,
      },
    })
  }

  const userByEmail = await prisma.user.findUnique({ where: { email } })
  if (userByEmail) {
    const username = await resolveUniqueUsername(usernameBase, clerkId, userByEmail.id)

    return prisma.user.update({
      where: { email },
      data: {
        clerkId,
        username,
      },
    })
  }

  const username = await resolveUniqueUsername(usernameBase, clerkId)

  return prisma.user.create({
    data: {
      clerkId,
      email,
      username,
    },
  })
}

router.post('/clerk', express.raw({ type: 'application/json' }), async (req: any, res: any) => {
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string)

  let evt: any
  try {
    evt = webhook.verify(req.body, req.headers)
  } catch (err) {
    return res.status(400).json({ message: 'Invalid webhook signature' })
  }

  if (evt.type === 'user.created' || evt.type === 'user.updated') {
    await syncClerkUser(evt.data)
  }

  if (evt.type === 'user.deleted') {
    try {
      await prisma.user.delete({
        where: { clerkId: evt.data.id }
      })
    } catch (err: any) {
      if (err.code !== 'P2025') throw err // re-throw anything that isn't "not found"
    }
  }

  res.status(200).json({ received: true })
})

export default router