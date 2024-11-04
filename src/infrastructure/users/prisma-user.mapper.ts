import { Gender, Role, User as UserModel } from '@prisma/client';
import { Injectable } from '@tsed/di';

import {
  User,
  UserAddress,
  UserBirthDate,
  UserEmail,
  UserGender,
  UserId,
  UserName,
  UserPasswordHash,
  UserPhoneNumber,
  UserProfilePicture,
  UserRole,
  UserUuid
} from '@domain/users';
import { UserUsername } from '@domain/users/user-username';

@Injectable()
class PrismaUserMapper {
  public static toDomainModel(userPersistenceModel: UserModel): User {
    return new User(
      new UserId(userPersistenceModel.id),
      new UserUuid(userPersistenceModel.uuid),
      UserGender.fromValue(userPersistenceModel.gender.toLowerCase()),
      new UserName(userPersistenceModel.firstName, userPersistenceModel.lastName),
      new UserBirthDate(userPersistenceModel.birthDate),
      new UserUsername(userPersistenceModel.username),
      new UserEmail(userPersistenceModel.email),
      new UserPhoneNumber(userPersistenceModel.phoneNumber),
      new UserAddress(userPersistenceModel.address),
      new UserProfilePicture(userPersistenceModel.profilePicUrl),
      new UserPasswordHash(userPersistenceModel.passwordHash),
      userPersistenceModel.roles.map(role => UserRole.fromValue(role.toLowerCase())),
      userPersistenceModel.verified,
      userPersistenceModel.enabled
    );
  }

  public static toPersistenceModel(user: User): UserModel {
    return {
      id: user.id?.value,
      uuid: user.uuid.value,
      gender: <Gender>user.gender.value.toUpperCase(),
      firstName: user.name.firstName,
      lastName: user.name.lastName,
      birthDate: user.birthDate.value,
      username: user.username.value,
      email: user.email.value,
      phoneNumber: user.phoneNumber.value,
      address: user.address.value,
      profilePicUrl: user.profilePicUrl.value,
      passwordHash: user.passwordHash.value,
      roles: user.roles.map(role => <Role>role.value.toUpperCase()),
      verified: user.verified,
      enabled: user.enabled
    } as UserModel;
  }
}

export { PrismaUserMapper };
