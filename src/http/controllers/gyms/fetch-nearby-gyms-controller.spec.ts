import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Fetch Nearby Gyms Controller (e2e)', () => {
  beforeAll(async () => {
    // antes dos testes aguardar o app terminar de ser inicializado
    await app.ready()
  })
  afterAll(async () => {
    // após os testes, fechar a aplicação
    await app.close()
  })

  // teste e2e para buscas academias próximas
  it('should be able to list nearby gyms', async () => {
    // utiliza hook para criar usuário, autenticar e retorna o token
    const { token } = await createAndAuthenticateUser(app)

    // criar acadedmias para posteriormente busca-las
    await request(app.server)
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

    await request(app.server)
      .post('/gyms')
      // envia token para requisição
      .set('Authorization', `Bearer ${token}`)
      // envia dados para criar academia
      .send({
        title: 'Python Gyn',
        Description: 'Some description',
        phone: '11999999999',
        latitude: -35.9049912,
        Longitude: -60.213212,
      })

    // request para buscar academias próximas com token
    const response = await request(app.server)
      .get('/gyms/nearby')
      // essa rota utiliza query params
      .query({
        latitude: -26.9049912,
        Longitude: -49.213212,
      })
      // envia token para requisição
      .set('Authorization', `Bearer ${token}`)
      .send()

    console.log('resposta da requisição:', response.body.message)

    expect(response.statusCode).toEqual(200)
    // espero que retorne tamanho 1
    expect(response.body.gyms).toHaveLength(1)
    // espero que no retorno exista academia com titulo Javascript Gym
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript Gyn',
      }),
    ])
  })
})
