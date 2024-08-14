import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate-use-case'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credetials-error'

// iniciar variávies utilizadas em todos os testes
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  // executar variáveis antes de cada teste, afim de isolar elas de cada teste
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(inMemoryUsersRepository)
  })

  // Teste para usuário conseguir se autenticar no app com sucesso
  it('Should be able to authenticate', async () => {
    // cadastrar usuṕario no repositório in memory antes de autenticar
    await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'mail@mail.com.br',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'mail@mail.com.br',
      password: '123456',
    })

    // espero que o id do usuário auutenticado seja uma string
    expect(user.id).toEqual(expect.any(String))
  })

  // Teste para nao ser possível autenticar com email invalido
  it('Should not be able to authenticate with wrong email', async () => {
    // no teste ele tenta se autenticar com email que nao existe no DB
    // execute é uma promisse qeu retorna uma instancia de erro
    expect(() =>
      sut.execute({
        email: 'mail@mail.com.br',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  // Teste para nao ser possível autenticar com senha invalida
  it('Should not be able to authenticate with wrong password', async () => {
    // no teste ele tenta se autenticar com senha que nao existe no DB
    // execute é uma promisse qeu retorna uma instancia de erro
    expect(() =>
      sut.execute({
        email: 'mail@mail.com.br',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
