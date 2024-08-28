import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'

export async function fetchNearbyGymsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchNearbyGymsSchema = z.object({
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

  const { latitude, longitude } = fetchNearbyGymsSchema.parse(request.body)

  // chama a factory de FetchNearbyGymsUseCase
  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  // pega retorno do caso de uso
  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({
    gyms,
  })
}
