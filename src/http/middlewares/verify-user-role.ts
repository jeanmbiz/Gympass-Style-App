import { FastifyReply, FastifyRequest } from 'fastify'

// é uma função que devolve um Middleware do Fastify
// vai receber a role como parâmetro
export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    // se role for diferente da role de verificação, retorna Unauthorized
    if (role !== roleToVerify) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}
