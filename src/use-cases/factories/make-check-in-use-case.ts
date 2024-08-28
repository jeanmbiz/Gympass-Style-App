import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { CreateCheckInUseCase } from '../create-check-in-use-case'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const createCheckInUseCase = new CreateCheckInUseCase(
    checkInsRepository,
    gymsRepository,
  )

  return createCheckInUseCase
}
