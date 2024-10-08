import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

export async function searchGymsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // valida parametros da query. ex: /search?query=javascript&sort=desc
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    // todo req.queryparams são strings
    // coerce converte string para número e faz validação
    page: z.coerce.number().min(1).default(1),
  })

  // busca parametros validados da query. ex: /search?query=javascript&sort=desc
  const { query, page } = searchGymsQuerySchema.parse(request.query)

  // chama a factory de SearchGymsUseCase
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
