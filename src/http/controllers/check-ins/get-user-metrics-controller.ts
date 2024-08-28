import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export async function GetUserMetricsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // chama a factory de GetUserMetricsUseCase
  const getUserMetricsUseCase = makeGetUserMetricsUseCase()

  // pega retorno do caso de uso
  const { checkInsCount } = await getUserMetricsUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    checkInsCount,
  })
}
