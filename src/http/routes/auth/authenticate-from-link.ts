import { Elysia, t } from 'elysia'
import { db } from '../../../db/connection'
import dayjs from 'dayjs'
import { auth } from '../../auth'
import { authLink } from '../../../db/schema'
import { eq } from 'drizzle-orm'
export const authenticateFromLink = new Elysia().use(auth)

authenticateFromLink.get(
  '/auth-links/authenticate',
  async ({ query, jwt, redirect, cookie: { auth } }) => {
    const { code, redirectUrl } = query
    const authLinkFromCode = await db.query.authLink.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code)
      },
    })
    if (!authLinkFromCode) {
      throw new Error('auth link not found')
    }
    const daysSinceAuthLinkWasCreated = dayjs().diff(
      authLinkFromCode.createAt,
      'days',
    )
    if (daysSinceAuthLinkWasCreated > 7) {
      throw new Error('link expirado')
    }
    const menagerRestaurants = await db.query.restaurante.findFirst({
      where(fields, { eq }) {
        return eq(fields.manageId, authLinkFromCode.userId)
      },
    })

    const token = await jwt.sign({
      sub: authLinkFromCode.userId,
      restaurantId: menagerRestaurants?.id,
    })
    auth.value = token
    auth.httpOnly = true
    auth.maxAge = 60 * 60 * 24 * 7
    auth.sameSite = 'strict'
    auth.path = '/'

    await db.delete(authLink).where(eq(authLink?.code, code))
    return redirect(redirectUrl)
  },

  {
    query: t.Object({
      code: t.String(),
      redirectUrl: t.String(),
    }),
  },
)
