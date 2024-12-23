import { BaseSoftDeleteEntity } from '@configuration/base-entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity('project_members')
export class ProjectMember extends BaseSoftDeleteEntity {
  @Column({ name: 'project_id', type: 'uuid', nullable: false })
  projectId: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  // relations
  @ManyToOne(() => User, (user) => user.projectMembers, { eager: false })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @ManyToOne(() => Project, (p) => p.members, { eager: false })
  @JoinColumn({
    name: 'project_id',
  })
  project: Project;
}
