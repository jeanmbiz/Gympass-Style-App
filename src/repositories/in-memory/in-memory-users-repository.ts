import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  // items representando a tabela de usuários
  public items: User[] = []

  // método de criar usuário, adiciona em items
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }

  // método de buscar usuário por email
  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }
}
