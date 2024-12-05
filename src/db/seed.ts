/* eslint-disable drizzle/enforce-delete-with-where */

import { faker } from '@faker-js/faker'
import { users, restaurante } from './schema'
import { db } from './connection'

await db.delete(users)
await db.delete(restaurante)

console.log('reset database 😊')

await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role: 'customer',
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role: 'customer',
  },
])

console.log(' create customer 🚀')

const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: 'admin@admin.com',
      phone: faker.phone.number(),
      role: 'manager',
    },
  ])
  .returning({
    id: users.id,
  })

console.log('create manager !!!')

await db.insert(restaurante).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    manageId: manager.id,
  },
])

console.log('create menager !!!')

console.log('database seeded sucessfully !')
process.exit()
