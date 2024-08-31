import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token Controller (e2e)', () => {
  beforeAll(async () => {
    // antes dos testes aguardar o app terminar de ser inicializado
    await app.ready()
  })
  afterAll(async () => {
    // após os testes, fechar a aplicação
    await app.close()
  })

  // teste e2e para atualizar JWT através do Refresh Token
  it('should be able to refresh a token', async () => {
    // request para criar usuário
    await request(app.server).post('/users').send({
      name: 'User',
      email: 'email@email.com.br',
      password: '123456',
    })

    // request para autenticar/logar usuário
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'email@email.com.br',
      password: '123456',
    })

    // pega cookies do usuário logado
    // Set-Cookie é o header de resposta qdo back gera um cookie
    const cookies = authResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('Refresh token not found or expired.')
    }

    // requisição para gerar novo token JWT com cookie do refresh token
    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    // espero que no body venha um novo token
    expect(response.body).toEqual({ token: expect.any(String) })
    // espero que o cookie da resposta, seja um array com string contendo 'refreshToken='
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
