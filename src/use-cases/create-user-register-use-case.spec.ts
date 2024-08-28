import { expect, describe, it, beforeEach } from 'vitest'
import { CreateUserRegisterUseCase } from './create-user-register-use-case'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

// iniciar variávies utilizadas em todos os testes
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateUserRegisterUseCase

describe('Register Use Case', () => {
  // executar variáveis antes de cada teste, afim de isolar elas de cada teste
  // o que está no before each não pe globalmente visivel em todos os testes
  // por isso tem que iniciar as variáceis com let no escopo global
  beforeEach(() => {
    // Mocka as dependências de RegisterUseCase utilizando o InMemoryUsersRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    // sut é a principal variavel que está sendo testada (no caso AuthenticateUseCase)
    // sut = System Under Test
    sut = new CreateUserRegisterUseCase(inMemoryUsersRepository)
  })

  // Teste para criar usuário com sucesso
  it('Should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Jean',
      email: 'mail@mail.com.br',
      password: '123456',
    })

    // espero que o id do usuário criado seja uma string
    expect(user.id).toEqual(expect.any(String))
  })

  // Teste para verificar se o hash da senha está sendo gerado
  it('Should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Jean',
      email: 'mail@mail.com.br',
      password: '123456',
    })

    // compare: compara senha com rash e retorna true ou false
    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    // espero que retorno do hash do password seja true
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  // Teste para não criar usuário com email repetido
  it('Should not be able to register with same email twice', async () => {
    const email = 'jeanmbiz@hotmail.com'

    // cadastra 1x
    await sut.execute({
      name: 'Jean',
      email,
      password: '123456',
    })

    // espero que a 2ª vez que tentar registrar o usuário com mesmo email
    // sempre que o expect tiver uma promisse dentro dele, utilizar await e () =>
    // o retorno do execute é uma promisse
    // a promisse deve rejeitar e retornar uma instância de UserAlreadyExistsError
    await expect(() =>
      sut.execute({
        name: 'Jean',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
