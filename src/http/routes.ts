import { FastifyInstance } from 'fastify'
import { registerController } from './controllers/register-controller'
import { authenticateController } from './controllers/authenticate-controller'
import { profileController } from './controllers/profile-controller'
import { verifyJWT } from './middlewares/verify.jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerController)

  // estou criando (post) uma sessão (/sessions) de login/autenticação
  app.post('/sessions', authenticateController)

  // rota buscar perfil autenticado
  // onRequest: executa antes do controller, passando middleware de verificação de token
  app.get('/me', { onRequest: [verifyJWT] }, profileController)
}
