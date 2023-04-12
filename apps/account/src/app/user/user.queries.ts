import { Body, Controller } from '@nestjs/common';
import { AccountGetInfo, AccountUserCourses } from '@purple/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserQueries {
  constructor(private readonly userRepository: UserRepository) {}

  @RMQValidate()
  @RMQRoute(AccountUserCourses.topic)
  async userCourses({
    id,
  }: AccountUserCourses.Request): Promise<AccountUserCourses.Response> {
    const user = await this.userRepository.findUserById(id);
    return { courses: user.courses };
  }

  @RMQValidate()
  @RMQRoute(AccountGetInfo.topic)
  async userInfo({
    id,
  }: AccountGetInfo.Request): Promise<AccountGetInfo.Response> {
    const user = await this.userRepository.findUserById(id);
    const profile = new UserEntity(user).getPublicProfile();
    return { profile };
  }
}
