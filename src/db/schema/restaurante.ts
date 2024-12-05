import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { users } from './users'

export const restaurante = pgTable('restaurants', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  manageId: text('manage_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('create_at').notNull().defaultNow(),
  updateAt: timestamp('update_at').notNull().defaultNow(),
})

export const restaurantsRelation = relations(restaurante, ({ one }) => {
  return {
    manager: one(users, {
      fields: [restaurante.manageId],
      references: [users.id],
      relationName: 'restaurant_manage',
    }),
  }
})
