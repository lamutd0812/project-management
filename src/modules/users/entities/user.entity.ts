import { BaseSoftDeleteEntity } from '@configuration/base-entity';
import { Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '@common/enums/common.enum';
import { TeamMember } from 'src/modules/teams/entities/team-member.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';

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
  @OneToMany(() => Task, (task) => task.asignee, { eager: false })
  tasks: Task[];

  @OneToMany(() => TeamMember, (tm) => tm.user, { eager: false })
  teamMembers: TeamMember[];
}
