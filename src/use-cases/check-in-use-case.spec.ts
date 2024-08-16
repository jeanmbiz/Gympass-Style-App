import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in-use-case'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-In Use Case', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(inMemoryCheckInsRepository, inMemoryGymsRepository)

    // cria academia para cada teste
    await inMemoryGymsRepository.create({
      id: 'gym-id',
      title: 'Javascript Gym',
      Description: '',
      phone: '',
      latitude: -26.9049912,
      Longitude: -49.213212,
    })

    // para usar Datas mockadas
    vi.useRealTimers()
  })

  afterEach(() => {
    // para voltar a utilizar Datas reais
    vi.useRealTimers()
  })

  // Teste para criar check in com sucesso
  it('Should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -26.9049912,
      userLongitude: -49.213212,
    })

    // espero que o id do usuário criado seja uma string
    expect(checkIn.id).toEqual(expect.any(String))
  })

  // Teste para não ser possível fazer check-in 2x no mesmo dia
  it('Should not be able to check in twice in the same day', async () => {
    // mockar Data de criação do Check-in (não tinha necessidade neste teste)
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    // cria check-in
    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -26.9049912,
      userLongitude: -49.213212,
    })

    // faz 2º check-in
    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-id',
        userLatitude: -26.9049912,
        userLongitude: -49.213212,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  // teste para ser possível fazer check-in em dias diferentes
  it('Should be able to check in twice in different days', async () => {
    // mockar Data de criação do 1º Check-in
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    // cria 1º check-in
    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -26.9049912,
      userLongitude: -49.213212,
    })

    // altera mockar Data de criação do 2º Check-in
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    // faz 2º check-in em outro dia
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -26.9049912,
      userLongitude: -49.213212,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  // Teste para nao ser possível fazer check-in fora da distancia permitida
  it('Should not be able to check in on distant gym', async () => {
    // criar nova academia com outra localização
    inMemoryGymsRepository.items.push({
      id: 'gym-02',
      title: 'Javascript Gyn',
      Description: '',
      latitude: new Decimal(-28.8580314),
      Longitude: new Decimal(-51.1891584),
      phone: '',
    })

    // faço check-in na academia 02 com minha localização
    // espero que lance erro por causa da distancia
    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-02',
        userLatitude: -26.9049912,
        userLongitude: -49.213212,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
