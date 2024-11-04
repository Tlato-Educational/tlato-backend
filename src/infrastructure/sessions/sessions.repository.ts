import { PrismaClient, Prisma } from '@prisma/client';
import { Injectable } from '@tsed/di';

import { Session } from '@domain/sessions/session';
import { SessionUuid } from '@domain/sessions/session-uuid';
import { Nullable } from '@domain/shared';
import { BaseRepository } from '@infrastructure/shared/persistence';
import { Repository } from '@infrastructure/shared/persistence/repository.decorator';

import { PrismaSessionMapper } from './prisma-session.mapper';

@Injectable()
@Repository()
export class SessionsRepository extends BaseRepository<Session> {
  private sessionsRepository: PrismaClient['session'];

  constructor(private prisma: PrismaClient) {
    super();
    this.sessionsRepository = this.prisma.session;
  }

  public async findByUuid(uuid: SessionUuid): Promise<Nullable<Session>> {
    return this.findOne({ uuid: uuid.value, deletedAt: null, revokedAt: null });
  }

  public async create(session: Session): Promise<Session> {
    return this.save(session);
  }

  public async update(session: Session): Promise<Session> {
    return this.save(session);
  }

  public async delete(uuid: SessionUuid): Promise<void> {
    await this.remove(uuid.value);
  }

  public async findOne(where: {
    uuid: string;
    deletedAt: Nullable<Date>;
    revokedAt: Nullable<Date>;
  }): Promise<Nullable<Session>> {
    const session = await this.sessionsRepository.findUnique({
      where
    });
    return session ? PrismaSessionMapper.toDomainModel(session) : null;
  }

  private async save(session: Session): Promise<Session> {
    const persistenceModel = PrismaSessionMapper.toPersistenceModel(session);
    const persistedSession = await this.sessionsRepository.upsert({
      where: { uuid: session.uuid.value },
      create: {
        ...persistenceModel,
        userData: persistenceModel.userData as Prisma.InputJsonValue
      },
      update: {
        ...persistenceModel,
        userData: persistenceModel.userData as Prisma.InputJsonValue
      }
    });
    return PrismaSessionMapper.toDomainModel(persistedSession);
  }

  private async remove(uuid: string): Promise<void> {
    await this.sessionsRepository.delete({
      where: { uuid }
    });
  }
}
