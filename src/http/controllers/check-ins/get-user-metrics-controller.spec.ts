import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get User Metrics Controller (e2e)', () => {
  beforeAll(async () => {
    // antes dos testes aguardar o app terminar de ser inicializado
    await app.ready()
  })
  afterAll(async () => {
    // após os testes, fechar a aplicação
    await app.close()
  })

  // teste e2e para lista metricas de check-in
  it('should be able to get the total count of check-ins ', async () => {
    // utiliza hook para criar usuário, autenticar e retorna o token
    const { token } = await createAndAuthenticateUser(app)

    // busca dados do usuário no banco
    const user = await prisma.user.findFirstOrThrow()

    // criar academia para fazer check-in direto pelo prisma
    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gyn',
        latitude: -26.9049912,
        Longitude: -49.213212,
      },
    })

    // request para criar 2 check-ins direto no banco de dados
    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    })

    // request para buscar metricas de check-ins do usuário
    const response = await request(app.server)
      .get(`/check-ins/metrics`)
      // envia token para requisição
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkInsCount).toEqual(2)
  })
})
