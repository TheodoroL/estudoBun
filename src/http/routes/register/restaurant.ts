import { Elysia, t } from 'elysia'
import { db } from '../../../db/connection'
import { users, restaurante } from '../../../db/schema'
export const registerRestaurant = new Elysia().post(
  '/restaurante',
  async ({ body, set }) => {
    const { restauranteName, managerName, email, phone } = body
    const [manager] = await db
      .insert(users)
      .values({
        name: managerName,
        email,
        phone,
        role: 'manager',
      })
      .returning({
        id: users.id,
      })
    await db.insert(restaurante).values({
      name: restauranteName,
      manageId: manager.id,
    })
    set.status = 204
  },
  {
    body: t.Object({
      restauranteName: t.String(),
      managerName: t.String(),
      phone: t.String(),
      email: t.String({ format: 'email' }),
    }),
  },
)
