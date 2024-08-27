import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify.jwt'
import { createGymController } from './create-gym-controller'
import { searchGymsController } from './search-gyms-controller'
import { fetchNearbyGymsController } from './fetch-nearby-gyms-controller'

export async function gymsRoutes(app: FastifyInstance) {
  // todas as rotas abaixo precisarão de autenticação verifyJWT
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms', createGymController)

  app.get('/gyms/search', searchGymsController)
  app.post('/gyms/nearby', fetchNearbyGymsController)
}
