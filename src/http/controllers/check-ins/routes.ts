import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify.jwt'
import { createCheckInController } from './create-check-in-controller'
import { ValidateCheckInController } from './validate-check-in-controller'
import { FetchUserCheckInsHistoryController } from './fetch-user-check-ins-history-controller'
import { GetUserMetricsController } from './get-user-metrics-controller'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function checkInsRoutes(app: FastifyInstance) {
  // todas as rotas abaixo precisarão de autenticação verifyJWT
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms/:gymId/check-ins', createCheckInController)

  app.get('/check-ins/history', FetchUserCheckInsHistoryController)
  app.get('/check-ins/metrics', GetUserMetricsController)

  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: verifyUserRole('ADMIN') },
    ValidateCheckInController,
  )
}
