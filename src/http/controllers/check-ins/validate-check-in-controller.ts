import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'

export async function ValidateCheckInController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // schema do checkInId vindo da rota URL
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  // busca checkInId de params da requisição
  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  // chama a factory de CreateCheckInUseCase
  const validateCheckInUseCase = makeValidateCheckInUseCase()

  await validateCheckInUseCase.execute({
    checkInId,
  })

  // 204 = resposta vazia para atualização de informação
  return reply.status(204).send()
}
