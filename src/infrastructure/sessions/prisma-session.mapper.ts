import { Session as SessionModel } from '@prisma/client';
import { Injectable } from '@tsed/di';

import {
  SessionRefreshTokenHash,
  SessionRevocationReason,
  SessionRevokedAt,
  SessionRevokedBy
} from '@domain/sessions/';
import { Session } from '@domain/sessions/session';
import { SessionExpiresAt } from '@domain/sessions/session-expires-at';
import { SessionId } from '@domain/sessions/session-id';
import { SessionUserData } from '@domain/sessions/session-user-data';
import { SessionUuid } from '@domain/sessions/session-uuid';

@Injectable()
class PrismaSessionMapper {
  public static toDomainModel(sessionPersistenceModel: SessionModel): Session {
    const { username, email, roles } = JSON.parse(sessionPersistenceModel.userData as string);
    return new Session(
      new SessionId(sessionPersistenceModel.id),
      new SessionUuid(sessionPersistenceModel.uuid),
      new SessionUuid(sessionPersistenceModel.userUuid),
      new SessionUserData(username, email, roles),
      new SessionRefreshTokenHash(sessionPersistenceModel.refreshTokenHash),
      new SessionExpiresAt(sessionPersistenceModel.expiresAt),
      sessionPersistenceModel.revokedAt ? new SessionRevokedAt(sessionPersistenceModel.revokedAt) : null,
      sessionPersistenceModel.revokedBy ? new SessionRevokedBy(sessionPersistenceModel.revokedBy) : null,
      sessionPersistenceModel.revocationReason
        ? new SessionRevocationReason(sessionPersistenceModel.revocationReason)
        : null
    );
  }

  public static toPersistenceModel(session: Session): SessionModel {
    return {
      id: session.id?.value,
      uuid: session.uuid.value,
      userUuid: session.userUuid.value,
      userData: JSON.stringify(session.userData.toJSON()),
      refreshTokenHash: session.refreshTokenHash.value,
      expiresAt: session.expiresAt.value,
      revokedAt: session.revokedAt?.value || null,
      revokedBy: session.revokedBy?.value || null,
      revocationReason: session.revocationReason?.value || null
    } as unknown as SessionModel;
  }
}

export { PrismaSessionMapper };
