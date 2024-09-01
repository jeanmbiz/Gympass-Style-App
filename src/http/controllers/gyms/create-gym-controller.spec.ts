import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym Controller (e2e)', () => {
  beforeAll(async () => {
    // antes dos testes aguardar o app terminar de ser inicializado
    await app.ready()
  })
  afterAll(async () => {
    // após os testes, fechar a aplicação
    await app.close()
  })

  // teste e2e para criar academia
  it('should be able to create a gym', async () => {
    // utiliza hook para criar usuário, autenticar e retorna o token
    const { token } = await createAndAuthenticateUser(app, true)

    // request para criar academia
    const response = await request(app.server)
      .post('/gyms')
      // envia token para requisição
      .set('Authorization', `Bearer ${token}`)
      // envia dados para criar academia
      .send({
        title: 'Javascript Gyn',
        Description: 'Some description',
        phone: '11999999999',
        latitude: -26.9049912,
        Longitude: -49.213212,
      })

    expect(response.statusCode).toEqual(201)
  })
})
