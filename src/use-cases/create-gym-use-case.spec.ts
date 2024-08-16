import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym-use-case'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

// iniciar variávies utilizadas em todos os testes
let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    // Mocka as dependências
    inMemoryGymsRepository = new InMemoryGymsRepository()
    // sut é a principal variavel que está sendo testada
    sut = new CreateGymUseCase(inMemoryGymsRepository)
  })

  // Teste para criar usuário com sucesso
  it('Should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'Javascript Gym',
      Description: null,
      phone: null,
      latitude: -26.9049912,
      Longitude: -49.213212,
    })

    // espero que o id criado seja uma string
    expect(gym.id).toEqual(expect.any(String))
  })
})
