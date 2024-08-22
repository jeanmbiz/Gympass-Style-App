import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    // jwtVerify: verifica se há token na rota e se foi gerado pela nossa aplicação
    await request.jwtVerify()
  } catch (error) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}
