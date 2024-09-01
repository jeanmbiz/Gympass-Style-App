import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Validate Check-in Controller (e2e)', () => {
  beforeAll(async () => {
    // antes dos testes aguardar o app terminar de ser inicializado
    await app.ready()
  })
  afterAll(async () => {
    // após os testes, fechar a aplicação
    await app.close()
  })

  // teste e2e para criar check-in
  it('should be able to validate a check-in', async () => {
    // utiliza hook para criar usuário, autenticar e retorna o token
    // passa como 2º parâmetro true, para criar usuário como admin
    const { token } = await createAndAuthenticateUser(app, true)

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

    // criar check-in direto pelo db para poder pegar ID
    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    // valida o check-in
    const response = await request(app.server)
      // coloca o id da academia criada no params
      .patch(`/check-ins/${checkIn.id}/validate`)
      // envia token para requisição
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    // busca check-in criado no DB para
    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })
    // espero que campo validated_at no DB foi preenchido com qualquer data
    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})
