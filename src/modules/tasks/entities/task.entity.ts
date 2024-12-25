import { TIMESTAMP_TYPE } from '@common/constants/constant';
import { BaseSoftDeleteEntity } from '@configuration/base-entity';
import { MailDetail } from 'src/modules/mailer/entities/mail-detail.entity';
import { Project } from 'src/modules/projects/entities/project.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity('tasks')
export class Task extends BaseSoftDeleteEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ name: 'due_date', type: 'date', nullable: false })
  dueDate: Date;

  @Column({ name: 'completed_at', type: TIMESTAMP_TYPE, nullable: true })
  completedAt: Date;

  @Column({ type: 'enum', nullable: false, enum: TaskStatus })
  status: TaskStatus;

  @Column({ name: 'project_id', type: 'uuid', nullable: false })
  projectId: string;

  @Column({ name: 'assignee_id', type: 'uuid', nullable: false })
  assigneeId: string;

  // relations
  @ManyToOne(() => Project, (project) => project.tasks, { eager: false })
  @JoinColumn({
    name: 'project_id',
  })
  project: Project;

  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  @JoinColumn({
    name: 'assignee_id',
  })
  assignee: User;

  @OneToMany(() => MailDetail, (md) => md.task, { eager: false })
  mailDetails: MailDetail[];
}
