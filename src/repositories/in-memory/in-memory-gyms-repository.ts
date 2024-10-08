import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { randomUUID } from 'crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  // items representando a tabela de academias
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      // prisma não aceita undefined
      Description: data.Description ?? null,
      phone: data.phone ?? null,
      // converter Latitude em formato aceto pelo prisma
      latitude: new Prisma.Decimal(data.latitude.toString()),
      Longitude: new Prisma.Decimal(data.Longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async findById(gymId: string) {
    const gym = this.items.find((item) => item.id === gymId)

    if (!gym) {
      return null
    }

    return gym
  }

  async searchMany(query: string, page: number) {
    return (
      this.items
        .filter((item) => item.title.includes(query))
        // lógica da paginação: slice retorna o índice do array
        .slice((page - 1) * 20, page * 20)
    )
  }

  async searchManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.Longitude.toNumber(),
        },
      )
      return distance < 10
    })
  }
}
