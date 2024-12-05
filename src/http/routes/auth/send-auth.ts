import { Elysia, t } from 'elysia'
import { db } from '../../../db/connection'
import { authLink } from '../../../db/schema'
import { createId } from '@paralleldrive/cuid2'

export const sendAuthLink = new Elysia().post(
  '/authenticate',
  async ({ body }) => {
    const { email } = body
    const userFormatEmail = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email)
      },
    })
    if (!userFormatEmail) {
      throw new Error('user not found')
    }
    const authLinkCode = createId()

    await db.insert(authLink).values({
      userId: userFormatEmail.id,
      code: authLinkCode,
    })

    const authURL = new URL(
      '/auth-links/authenticate',
      process.env.API_BASE_URL!,
    )
    authURL.searchParams.set('code', authLinkCode)
    authURL.searchParams.set('redirectUrl', process.env.AUTH_REDIRECT_URL!)
    console.log(authURL.toString())
  },

  {
    body: t.Object({
      email: t.String({ format: 'email' }),
    }),
  },
)
