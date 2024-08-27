import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate Controller (e2e)', () => {
  beforeAll(async () => {
    // antes dos testes aguardar o app terminar de ser inicializado
    await app.ready()
  })
  afterAll(async () => {
    // após os testes, fechar a aplicação
    await app.close()
  })

  // teste e2e para logar/autenticar novo usuário
  it('should be able to authenticate', async () => {
    // request para criar novo usuário
    await request(app.server).post('/users').send({
      name: 'User',
      email: 'email@email.com.br',
      password: '123456',
    })

    // request para autenticar/logar usuário
    const response = await request(app.server).post('/sessions').send({
      email: 'email@email.com.br',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    // espero que no corpo da resposta, venha um token, e ele é qualquer string
    expect(response.body).toEqual({ token: expect.any(String) })
  })
})
