import { TIMESTAMP_TYPE } from '@common/constants/constant';
import { BaseSoftDeleteEntity } from '@configuration/base-entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { ProjectMember } from './project-member.entity';

export enum ProjectStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity('projects')
export class Project extends BaseSoftDeleteEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ name: 'due_date', type: 'date', nullable: false })
  dueDate: Date;

  @Column({ name: 'completed_at', type: TIMESTAMP_TYPE, nullable: true })
  completedAt: Date;

  @Column({ type: 'enum', nullable: false, enum: ProjectStatus })
  status: ProjectStatus;

  @OneToMany(() => Task, (task) => task.project, { eager: false })
  tasks: Task[];

  @OneToMany(() => ProjectMember, (pm) => pm.project, { eager: false })
  members: ProjectMember[];
}
