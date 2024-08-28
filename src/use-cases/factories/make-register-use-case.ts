import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateUserRegisterUseCase } from '../create-user-register-use-case'

export function makeCreateUserRegisterUseCase() {
  // todas as dependências de CreateUserRegisterUseCase centralizadas
  const usersRepository = new PrismaUsersRepository()
  const createUserRegisterUseCase = new CreateUserRegisterUseCase(
    usersRepository,
  )

  return createUserRegisterUseCase
}
