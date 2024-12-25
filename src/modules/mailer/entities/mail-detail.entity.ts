import { BaseSoftDeleteEntity } from '@configuration/base-entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum MailDetailStatus {
  SUCCESS = 'Success',
  FAILED = 'Failed',
}

export enum MailDetailType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_DEADLINE_APPROACHING = 'task_deadline_approaching',
}

@Entity('mail_details')
export class MailDetail extends BaseSoftDeleteEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  from: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  to: string;

  @Column({ type: 'enum', nullable: true, enum: MailDetailType })
  mailType: MailDetailType;

  @Column({ name: 'mail_subject', type: 'varchar', nullable: true })
  mailSubject: string;

  @Column({ name: 'mail_template', type: 'varchar', nullable: true })
  mailTemplate: string;

  @Column({ name: 'task_id', type: 'varchar', nullable: true })
  taskId: string;

  @Column({ type: 'enum', nullable: true, enum: MailDetailStatus })
  status: MailDetailStatus;

  @ManyToOne(() => Task, (task) => task.mailDetails, { eager: false })
  @JoinColumn({
    name: 'task_id',
  })
  task: Task;
}
