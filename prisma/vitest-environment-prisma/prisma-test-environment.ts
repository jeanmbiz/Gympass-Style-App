import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// postgresql://jeanmbiz:jmb1987@localhost:5432/api-gympass?schema=public

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  // searchParams = schema=public
  // muda schema do banco para novo schema criado
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    // nome do novo schema do db
    const schema = randomUUID()
    // gera nova databaseURL
    const databaseURL = generateDatabaseURL(schema)

    // sobrescreve o env com nova databaseURL
    process.env.DATABASE_URL = databaseURL

    // executa migrations para criar tabelas no novo schema
    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        // apagar banco de dados criado depois dos testes
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
