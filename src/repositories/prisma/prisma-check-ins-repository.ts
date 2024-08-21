import { prisma } from './../../lib/prisma'
import { Prisma, CheckIn } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    })
    return checkIn
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })
    return checkIn
  }

  async findById(checkInId: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id: checkInId,
      },
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      // pegar: 20 itens por página
      take: 20,
      // pular: quantos itens quero pular
      skip: (page - 1) * 20,
    })

    return checkIns
  }

  // método para buscar checkin do usuário em uma data
  async findByUserIdOnDate(userId: string, date: Date) {
    // Dia atual com hora zerada - inicio do dia
    const startOfTheDay = dayjs(date).startOf('date')

    // Dia atual com hora 23:59 - final do dia
    const endOfTheDay = dayjs(date).endOf('date')

    // findFirst pois created_at não é unique
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        // quer buscar descartando hora/minuto/segundo
        created_at: {
          // após o inicio deste dia
          gte: startOfTheDay.toDate(),
          // antes do fim deste dia
          lte: endOfTheDay.toDate(),
        },
      },
    })

    return checkIn
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return count
  }
}
