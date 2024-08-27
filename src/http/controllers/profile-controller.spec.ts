import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Profile Controller (e2e)', () => {
  beforeAll(async () => {
    // antes dos testes aguardar o app terminar de ser inicializado
    await app.ready()
  })
  afterAll(async () => {
    // após os testes, fechar a aplicação
    await app.close()
  })

  // teste e2e para buscar perfil do usuário logado
  it('should be able to get user profile', async () => {
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

    // request para listar perfil do usuário autenticado com token
    const profileResponse = await request(app.server)
      .get('/me')
      // envia token para requisição
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    // espero que me retorne um objeto contendo email igual ao do usuário criado
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({ email: 'email@email.com.br' }),
    )
  })
})
