import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history-use-case'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-In History Use Case', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(inMemoryCheckInsRepository)
  })

  // Teste para listar check ins de um usuário com sucesso
  it('Should be able to fetch check-in history', async () => {
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

    // busca check-ins do usuário 'user-01'
    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    // espero que a lista tenha tamanho 2
    expect(checkIns).toHaveLength(2)
    // espero que a lista seja um array com 2 objetos contendo gym_id 1 e 2
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  // Teste para listar check ins de um usuário com paginação
  it('Should be able to fetch paginated user check-in history', async () => {
    // criar 22 check-ins fake
    for (let i = 1; i <= 22; i++) {
      await inMemoryCheckInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    // busca check-ins do usuário 'user-01'
    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    // espero que a lista tenha tamanho 2
    expect(checkIns).toHaveLength(2)
    // espero que a lista seja um array com 2 objetos contendo gym_id 21 e 22
    // seria a página 2 do get
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
