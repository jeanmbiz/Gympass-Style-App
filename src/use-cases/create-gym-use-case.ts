import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface CreateGymUseCaseRequest {
  title: string
  // diferença entre undefined (?) e nulo
  // null quando quero tirar a descrição
  // undefined (?) quando eu nao quero alterar
  Description: string | null
  phone: string | null
  latitude: number
  Longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  // construtor recebe as dependências - Inversão de Dependência
  constructor(private gymsRepository: GymsRepository) {}
  async execute({
    title,
    Description,
    phone,
    latitude,
    Longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      Description,
      phone,
      latitude,
      Longitude,
    })

    return { gym }
  }
}
