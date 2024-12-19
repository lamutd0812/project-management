import { BaseSoftDeleteEntity } from '@configuration/base-entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Team } from './team.entity';

@Entity('team_members')
export class TeamMember extends BaseSoftDeleteEntity {
  @Column({ name: 'team_id', type: 'uuid', nullable: false })
  teamId: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  // relations
  @ManyToOne(() => User, (user) => user.teamMembers, { eager: false })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @ManyToOne(() => Team, (team) => team.teamMembers, { eager: false })
  @JoinColumn({
    name: 'team_id',
  })
  team: Team;
}
