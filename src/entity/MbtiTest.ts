import {
  Column, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { DiscordUser } from './DiscordUser';

@Entity()
export class MbtiTest {
  @PrimaryColumn({ generated: 'uuid', type: 'uuid' })
    id: string;

  @ManyToOne(
    () => DiscordUser,
    (user) => user.tests,
    { onDelete: 'CASCADE' },
  )
    user: DiscordUser;

  @Column()
    step: number;

  @Column({ default: false })
    completed: boolean;

  @Column({ nullable: true, type: 'char', length: 4 })
    result?: string;

  @Column({ default: 0 })
    e: number;

  @Column({ default: 0 })
    i: number;

  @Column({ default: 0 })
    n: number;

  @Column({ default: 0 })
    s: number;

  @Column({ default: 0 })
    t: number;

  @Column({ default: 0 })
    f: number;

  @Column({ default: 0 })
    j: number;

  @Column({ default: 0 })
    p: number;

  @Column({ nullable: true })
    completedAt?: Date;
}
