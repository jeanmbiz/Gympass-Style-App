import { FastifyReply, FastifyRequest } from 'fastify'

export async function profileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // jwtVerify: verifica se há token e se foi gerado pela nossa aplicação
  await request.jwtVerify()

  console.log(request.user.sub)

  return reply.status(200).send()
}
