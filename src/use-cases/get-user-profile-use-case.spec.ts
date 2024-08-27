import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetUserProfileUseCase } from './get-user-profile-use-case'

// iniciar variávies utilizadas em todos os testes
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  // executar variáveis antes de cada teste, afim de isolar elas de cada teste
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(inMemoryUsersRepository)
  })

  // Teste para buscar usuário com sucesso
  it('Should be able to get user profile', async () => {
    // cadastrar usuṕario no repositório in memory antes de buscar
    const createdUser = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'mail@mail.com.br',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    // espero que o nome do usuário seja John Doe
    expect(user.name).toEqual('John Doe')
  })

  // Teste para nao ser possível buscar usuário com id invalido
  it('Should not be able to authenticate with wrong email', async () => {
    // no teste ele tenta buscar usuário com id que nao existe no DB
    // execute é uma promisse qeu retorna uma instancia de erro
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
