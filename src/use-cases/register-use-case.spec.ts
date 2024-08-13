import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register-use-case'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
  it('Should hash user password upon registration', async () => {
    // Mocka as dependências de RegisterUseCase, que é o construtor UsersRepository
    const registerUseCase = new RegisterUseCase({
      // mocka o retorno da criação de usuário
      async create(data) {
        return {
          id: '1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
      // mcokar outro método do UsersRepository
      // retorna null pois não estamos utlizando ele no teste
      async findByEmail() {
        return null
      },
    })

    const { user } = await registerUseCase.execute({
      name: 'Jean',
      email: 'mail@mail.com.br',
      password: '123456',
    })

    // compare: compara senha com rash e retorna true ou false
    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
