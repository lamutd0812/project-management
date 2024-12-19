import { BaseSoftDeleteEntity } from '@configuration/base-entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { TeamMember } from './team-member.entity';
import { Project } from 'src/modules/projects/entities/project.entity';

@Entity('teams')
export class Team extends BaseSoftDeleteEntity {
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  // relations
  @OneToMany(() => TeamMember, (tm) => tm.user, { eager: false })
  teamMembers: TeamMember[];

  @OneToMany(() => Project, (project) => project.team, { eager: false })
  projects: Project[];
}
