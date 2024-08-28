import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export async function createCheckInController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // schema do gymId vindo da rota URL
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    // refine para validação que não é padrão do zod
    latitude: z.number().refine((value) => {
      // validalçao de latitude ser <= +-90
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      // validalçao de latitude ser <= +-180
      return Math.abs(value) <= 180
    }),
  })

  // busca gymId de params
  const { gymId } = createCheckInParamsSchema.parse(request.params)
  // busca dados do body
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  // chama a factory de CreateCheckInUseCase
  const createCheckInUseCase = makeCheckInUseCase()

  await createCheckInUseCase.execute({
    gymId,
    // request.user.sub - busca id do token do usuário
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
