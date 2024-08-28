import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'

export async function FetchUserCheckInsHistoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // valida parametros da query. ex: /search?query=javascript&sort=desc
  const fetchUserCheckInsHistoryQuerySchema = z.object({
    // todo req.queryparams são strings
    // coerce converte string para número e faz validação
    page: z.coerce.number().min(1).default(1),
  })

  // busca parametros validados da query. ex: /search?query=javascript&sort=desc
  const { page } = fetchUserCheckInsHistoryQuerySchema.parse(request.query)

  // chama a factory de FetchUserCheckInsHistoryUseCase
  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

  // pega retorno do caso de uso
  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}
