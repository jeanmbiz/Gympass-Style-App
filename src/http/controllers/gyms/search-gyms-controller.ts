import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

export async function searchGymsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchGymsQueryParamsSchema = z.object({
    query: z.string(),
    // todo req.queryparams são strings
    // coerce converte string para número e faz validação
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchGymsQueryParamsSchema.parse(request.body)

  // chama a factory de RegisterUseCase
  const searchGymsUseCase = makeSearchGymsUseCase()

  // pega retorno do caso de uso
  const { gyms } = await searchGymsUseCase.execute({
    query,
    page,
  })

  return reply.status(200).send({
    gyms,
  })
}
