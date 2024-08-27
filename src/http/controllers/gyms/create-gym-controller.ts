import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function createGymController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createGymBodySchema = z.object({
    title: z.string(),
    Description: z.string().nullable(),
    phone: z.string().nullable(),
    // refine para validação que não é padrão do zod
    latitude: z.number().refine((value) => {
      // validalçao de latitude ser <= +-90
      return Math.abs(value) <= 90
    }),
    Longitude: z.number().refine((value) => {
      // validalçao de latitude ser <= +-180
      return Math.abs(value) <= 180
    }),
  })

  const { title, Description, phone, latitude, Longitude } =
    createGymBodySchema.parse(request.body)

  // chama a factory de RegisterUseCase
  const createGymUseCase = makeCreateGymUseCase()

  await createGymUseCase.execute({
    title,
    Description,
    phone,
    latitude,
    Longitude,
  })

  return reply.status(201).send()
}
