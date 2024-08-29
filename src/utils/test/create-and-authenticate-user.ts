import { FastifyInstance } from 'fastify'
import request from 'supertest'

// app é uma instancia do Fastify, que será passada ao chamar função
export async function createAndAuthenticateUser(app: FastifyInstance) {
  // request para criar novo usuário
  await request(app.server).post('/users').send({
    name: 'User',
    email: 'email@email.com.br',
    password: '123456',
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
