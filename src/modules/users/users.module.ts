import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ActivityLogsModule, MailerModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
