import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in-use-case'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-In Use Case', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(inMemoryCheckInsRepository)

    // para usar Datas mockadas
    vi.useFakeTimers()
  })

  afterEach(() => {
    // para voltar a utilizar Datas reais
    vi.useRealTimers()
  })

  // Teste para academia validar checkIn do usuário
  it('Should be able to validate the check-in', async () => {
    // criar checkIn
    const createdCheckIn = await inMemoryCheckInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    // executa validação do checkIn e pega o retorno
    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    // espero validated_at seja alguma data
    expect(checkIn.validated_at).toEqual(expect.any(Date))

    // espero que o 1º item criado inMemoryCheckInsRepository em validated_at seja uma data
    expect(inMemoryCheckInsRepository.items[0].validated_at).toEqual(
      expect.any(Date),
    )
  })

  // Teste lançar erro ao tentar validar checkIn que nao existe
  it('Should not be able to validate an inexistent check-in', async () => {
    // espero que checkIn com id inexistente retorne erro
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  // Teste não ser possível validar check-in 20 min após sua criação
  it('Should not be able to validate the check-in after 20 minutes of its creation', async () => {
    // setando data e hora atual
    // 13:40hrs do dia 01/01/2023
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    // criar checkIn
    const createdCheckIn = await inMemoryCheckInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    // 21 minutos em milissegundos
    const twentyOneMinutesInMs = 1000 * 60 * 21

    // avança no tempo 21min da hora atual
    vi.advanceTimersByTime(twentyOneMinutesInMs)

    // espero que ao validar checkIn, rejeite por erro de tempo
    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
