import { PrismaClient } from '@prisma/client'
import { config } from '@/lib/server/config'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (config.nodeEnv !== 'production') globalForPrisma.prisma = prisma 