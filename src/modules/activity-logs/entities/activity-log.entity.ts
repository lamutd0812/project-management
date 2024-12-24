import { BaseSoftDeleteEntity } from '@configuration/base-entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum ActivityLogCategory {
  USERS = 'Users',
  PROJECTS = 'Projects',
  TASKS = 'Tasks',
}

@Entity('activity_logs')
export class ActivityLog extends BaseSoftDeleteEntity {
  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'enum', nullable: false, enum: ActivityLogCategory })
  category: ActivityLogCategory;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @Column({ name: 'project_id', type: 'uuid', nullable: true })
  projectId: string;

  @Column({ name: 'task_id', type: 'uuid', nullable: true })
  taskId: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: false })
  createdBy: string;

  // relations
  @ManyToOne(() => User, (user) => user.activityLogs, { eager: false })
  @JoinColumn({
    name: 'created_by',
  })
  creator: User;
}
