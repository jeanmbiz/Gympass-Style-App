import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credetials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    // chama a factoru de AuthenticateUseCase
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    // jwtSign: server para gerar token do usuário
    const token = await reply.jwtSign(
      {
        // guarda informações adicionais do usuário
        email: user.email,
      },
      {
        sign: {
          // sub: campo reservado no token JWT para guardar id do usuário
          sub: user.id,
        },
      },
    )

    // criar refresh token
    // usuário vai perder autenticação se ficar 7 dias sem entrar nela
    const refreshToken = await reply.jwtSign({
      sign: {
        // sub: campo reservado no token JWT para guardar id do usuário
        sub: user.id,
        expiresIn: '7d', // expira em 7 dias
      },
    })

    return (
      reply
        // envia refreshToken através de cookie
        .setCookie('refreshToken', refreshToken, {
          // configurações de segurança do cookie
          // path: todas as rotas back-end terão acesso ao cookie
          path: '/',
          // secure: cookie será encriptado atraves do https
          secure: true,
          // sameSite: cookie só sera acessível dentro do mesmo domínio
          sameSite: true,
          // httpOnly: cookie só será acessado atraves de req e res no Back-end, não será salvo no browser do front
          httpOnly: true,
        })
        .status(200)
        .send({
          token,
        })
    )
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
}
