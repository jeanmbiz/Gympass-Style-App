import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'

export async function fetchNearbyGymsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // valida parametros da query. ex: /search?query=javascript&sort=desc
  const fetchNearbyGymsQuerySchema = z.object({
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

  // busca parametros validados da query. ex: /search?query=javascript&sort=desc
  const { latitude, longitude } = fetchNearbyGymsQuerySchema.parse(
    request.query,
  )

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
