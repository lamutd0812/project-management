import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectMemberRepository } from './repositories/project-member.repository';
import { ProjectMember } from './entities/project-member.entity';
import { UsersModule } from '../users/users.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectMember]),
    UsersModule,
    ActivityLogsModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectRepository, ProjectMemberRepository],
  exports: [ProjectsService],
})
export class ProjectsModule {}
