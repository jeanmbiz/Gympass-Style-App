import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms-use-case'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(inMemoryGymsRepository)
  })

  // Teste para listar academias pelo título
  it('Should be able to fetch nearby gyms', async () => {
    // criar academia fake
    await inMemoryGymsRepository.create({
      title: 'Near Gym',
      Description: null,
      phone: null,
      latitude: -26.9049912,
      Longitude: -49.213212,
    })

    // criar 2º academia fake
    await inMemoryGymsRepository.create({
      title: 'Far Away Gym',
      Description: null,
      phone: null,
      latitude: -35.9049912,
      Longitude: -60.213212,
    })

    // busca academias pelo títylo (query)
    const { gyms } = await sut.execute({
      userLatitude: -26.9049912,
      userLongitude: -49.213212,
    })

    // espero que a lista tenha tamanho 1
    expect(gyms).toHaveLength(1)
    // espero que a lista seja um array com 1 objeto contendo Near Gym
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
