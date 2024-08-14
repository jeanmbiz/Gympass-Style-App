import { FastifyInstance } from 'fastify'
import { registerController } from './controllers/register-controller'
import { authenticateController } from './controllers/authenticate-controller'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerController)

  // estou criando (post) uma sessão (/sessions) de login/autenticação
  app.post('/sessions', authenticateController)
}
