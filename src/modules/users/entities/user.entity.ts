import { BaseSoftDeleteEntity } from '@configuration/base-entity';
import { Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '@common/enums/common.enum';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { ProjectMember } from 'src/modules/projects/entities/project-member.entity';
import { TIMESTAMP_TYPE } from '@common/constants/constant';
import { ActivityLog } from 'src/modules/activity-logs/entities/activity-log.entity';

@Entity('users')
export class User extends BaseSoftDeleteEntity {
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  salt: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ name: 'reset_pwd_otp', type: 'integer', nullable: true })
  resetPwdOtp: number;

  @Column({ name: 'reset_pwd_exp_time', type: TIMESTAMP_TYPE, nullable: true })
  resetPwdExpTime: Date;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  phoneNumber: string;

  @Column({ type: 'enum', nullable: false, enum: Role })
  role: Role;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  // relations
  @OneToMany(() => Task, (task) => task.assignee, { eager: false })
  tasks: Task[];

  @OneToMany(() => ProjectMember, (pm) => pm.user, { eager: false })
  projectMembers: ProjectMember[];

  @OneToMany(() => ActivityLog, (al) => al.creator, { eager: false })
  activityLogs: ActivityLog[];
}
