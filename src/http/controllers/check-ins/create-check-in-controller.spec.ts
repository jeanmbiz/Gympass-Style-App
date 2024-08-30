import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Check-in Controller (e2e)', () => {
  beforeAll(async () => {
    // antes dos testes aguardar o app terminar de ser inicializado
    await app.ready()
  })
  afterAll(async () => {
    // após os testes, fechar a aplicação
    await app.close()
  })

  // teste e2e para criar check-in
  it('should be able to create a check-in', async () => {
    // utiliza hook para criar usuário, autenticar e retorna o token
    const { token } = await createAndAuthenticateUser(app)

    // criar academia para fazer check-in direto pelo prisma
    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gyn',
        latitude: -26.9049912,
        Longitude: -49.213212,
      },
    })

    // request para criar check-in
    const response = await request(app.server)
      // coloca o id da academia criada no params
      .post(`/gyms/${gym.id}/check-ins`)
      // envia token para requisição
      .set('Authorization', `Bearer ${token}`)
      // envia dados para criar academia
      .send({
        latitude: -26.9049912,
        longitude: -49.213212,
      })

    expect(response.statusCode).toEqual(201)
  })
})
