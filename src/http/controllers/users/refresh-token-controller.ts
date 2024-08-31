import { FastifyRequest, FastifyReply } from 'fastify'
import { FastifyError } from '@fastify/error' // Importa a classe de erros do Fastify

export async function refreshTokenController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    // Verifica somente o cookie do refresh token, se é válido e se não expirou
    await request.jwtVerify({ onlyCookie: true })

    // Gera um novo token para o usuário
    const token = await reply.jwtSign(
      {
        email: request.user.email,
      },
      {
        sign: {
          sub: request.user.sub,
        },
      },
    )

    // Cria um novo refresh token
    const refreshToken = await reply.jwtSign(
      {
        email: request.user.email,
      },
      {
        sign: {
          sub: request.user.sub,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      })
  } catch (error) {
    if ((error as FastifyError).code === 'FST_JWT_NO_AUTHORIZATION_IN_COOKIE') {
      // Se o token de autorização não for encontrado no cookie, retorne uma resposta 401
      return reply
        .status(401)
        .send({ message: 'Refresh token not found or expired.' })
    }

    // Lida com outros possíveis erros
    return reply.status(500).send({ message: 'An unexpected error occurred.' })
  }
}
