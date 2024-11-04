import { Session as SessionModel } from '@prisma/client';
import { Injectable } from '@tsed/di';

import { Session } from '@domain/sessions/session';
import { SessionRepository } from '@domain/sessions/session.repository';
import { SessionUuid } from '@domain/sessions/session-uuid';
import { Nullable } from '@domain/shared';
import { GlobalConfig } from '@infrastructure/shared/config';
import { Repository } from '@infrastructure/shared/persistence';
import { PrismaBaseRepository } from '@infrastructure/shared/persistence/prisma/prisma-base-repository';

import { SessionsRepository } from './sessions.repository';

@Injectable()
@Repository({ enabled: GlobalConfig.STORE_SESSIONS_IN_DB, type: SessionRepository })
class PrismaSessionRepository extends PrismaBaseRepository<SessionModel> implements SessionRepository {
  private sessionRepository: SessionsRepository;

  constructor(sessionRepository: SessionsRepository) {
    super();
    this.sessionRepository = sessionRepository;
  }

  public async findByUuid(uuid: SessionUuid): Promise<Nullable<Session>> {
    return this.sessionRepository.findOne({
      uuid: uuid.value,
      deletedAt: null,
      revokedAt: null
    });
  }

  public async create(session: Session): Promise<Session> {
    return this.sessionRepository.create(session);
  }

  public async update(session: Session): Promise<Session> {
    return this.sessionRepository.update(session);
  }

  public async delete(uuid: SessionUuid): Promise<void> {
    await this.sessionRepository.delete(uuid);
  }
}

export { PrismaSessionRepository };
