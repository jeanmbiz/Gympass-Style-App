import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

// app é uma instancia do Fastify, que será passada ao chamar função
// recebe como parâmetro se é admin, padrão false
export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  // criar usuário pelo prisma, passando se é admin
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'email@email.com.br',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  // request para logar usuário
  const authResponse = await request(app.server).post('/sessions').send({
    email: 'email@email.com.br',
    password: '123456',
  })

  // pego token de autenticação do usuáiro logado
  const { token } = authResponse.body

  return { token }
}
