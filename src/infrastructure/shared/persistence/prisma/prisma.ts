import { PrismaClient } from '@prisma/client';
import { registerProvider } from '@tsed/di';

const PRISMA_CONNECTION = Symbol.for('PrismaConnection');

const prismaClient = new PrismaClient();

registerProvider({
  provide: PRISMA_CONNECTION,
  useValue: prismaClient,
  type: PrismaClient
});

export { PRISMA_CONNECTION, prismaClient };
