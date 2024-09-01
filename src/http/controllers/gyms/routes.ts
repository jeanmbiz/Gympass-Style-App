import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify.jwt'
import { createGymController } from './create-gym-controller'
import { searchGymsController } from './search-gyms-controller'
import { fetchNearbyGymsController } from './fetch-nearby-gyms-controller'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  // todas as rotas abaixo precisarão de autenticação verifyJWT
  app.addHook('onRequest', verifyJWT)

  // adiciona verificação de role passando como parâmetro a role necessária
  app.post('/gyms', { onRequest: verifyUserRole('ADMIN') }, createGymController)

  app.get('/gyms/search', searchGymsController)
  app.get('/gyms/nearby', fetchNearbyGymsController)
}
