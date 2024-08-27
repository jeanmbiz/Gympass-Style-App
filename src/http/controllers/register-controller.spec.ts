import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register Controller (e2e)', () => {
  beforeAll(async () => {
    // antes dos testes aguardar o app terminar de ser inicializado
    await app.ready()
  })
  afterAll(async () => {
    // após os testes, fechar a aplicação
    await app.close()
  })

  // teste e2e para criar novo usuário
  it('should be able to register', async () => {
    // request para criar novo usuário
    const response = await request(app.server).post('/users').send({
      name: 'User',
      email: 'email@email.com.br',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
