import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
import { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  // items representando a tabela de CheckIn
  public items: CheckIn[] = []

  // método de criar check-in deusuário na academia, adiciona em items
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  // método para buscar uma lista de check-ins de um usuário
  async findManyByUserId(userId: string, page: number) {
    return (
      this.items
        .filter((item) => item.user_id === userId)
        // lógica da paginação: slice retorna o índice do array
        .slice((page - 1) * 20, page * 20)
    )
  }

  // método para buscar checkin do usuário em uma data
  async findByUserIdOnDate(userId: string, date: Date) {
    // Dia atual com hora zerada - inicio do dia
    const startOfTheDay = dayjs(date).startOf('date')

    // Dia atual com hora 23:59 - final do dia
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)

      // verifica se o Check-in é após o inicio do dia e anterior ao final do dia
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  // método para retornar quantidade de check-ins de um usuário
  async countByUserId(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length
  }
}
