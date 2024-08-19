import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms-use-case'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(inMemoryGymsRepository)
  })

  // Teste para listar academias pelo título
  it('Should be able to search for gyms', async () => {
    // criar academia fake
    await inMemoryGymsRepository.create({
      title: 'Javascript Gym',
      Description: null,
      phone: null,
      latitude: -26.9049912,
      Longitude: -49.213212,
    })

    // criar 2º academia fake
    await inMemoryGymsRepository.create({
      title: 'Python Gym',
      Description: null,
      phone: null,
      latitude: -26.9049912,
      Longitude: -49.213212,
    })

    // busca academias pelo títylo (query)
    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1,
    })

    // espero que a lista tenha tamanho 1
    expect(gyms).toHaveLength(1)
    // espero que a lista seja um array com 1 objeto contendo gym Javascript
    expect(gyms).toEqual([expect.objectContaining({ title: 'Javascript Gym' })])
  })

  // Teste para listar academias com paginação
  it.skip('Should be able to fetch paginated gyms search', async () => {
    // criar 22 check-ins fake
    for (let i = 1; i <= 22; i++) {
      await inMemoryGymsRepository.create({
        title: `Javascript Gym ${i}`,
        Description: null,
        phone: null,
        latitude: -26.9049912,
        Longitude: -49.213212,
      })
    }

    // busca check-ins do usuário 'user-01'
    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    })

    // espero que a lista tenha tamanho 2
    expect(gyms).toHaveLength(2)
    // espero que a lista seja um array contendo gym título Javascript Gym 21 e 22
    // seria a página 2 do get
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym 21' }),
      expect.objectContaining({ title: 'Javascript Gym 22' }),
    ])
  })
})
