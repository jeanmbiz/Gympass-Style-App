import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify.jwt'

import { registerController } from './register-controller'
import { authenticateController } from './authenticate-controller'
import { profileController } from './profile-controller'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', registerController)

  // estou criando um (post), da rota (/sessions) de autenticação controller
  app.post('/sessions', authenticateController)

  // rota buscar perfil autenticado
  // onRequest: executa antes do controller, passando middleware de verificação de token
  app.get('/me', { onRequest: [verifyJWT] }, profileController)
}
