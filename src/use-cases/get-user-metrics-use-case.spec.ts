import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics-use-case'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(inMemoryCheckInsRepository)
  })

  // Teste para listar check ins de um usuário com sucesso
  it('Should be able to get user check-ins count from metrics', async () => {
    // criar check-in fake
    await inMemoryCheckInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    // criar 2º check-in fake
    await inMemoryCheckInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    // busca nº heck-ins do usuário 'user-01'
    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    // espero que checkInsCount seja 2
    expect(checkInsCount).toEqual(2)
  })
})
