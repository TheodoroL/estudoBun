import { Elysia } from 'elysia'
import { registerRestaurant } from './routes/register/restaurant'
import { sendAuthLink } from './routes/auth/send-auth'
import { auth } from './auth'
import { authenticateFromLink } from './routes/auth/authenticate-from-link'

const app = new Elysia()
  .use(auth)
  .use(registerRestaurant)
  .use(authenticateFromLink)
  .use(sendAuthLink)
app.listen(8080, () => console.log('api run'))
