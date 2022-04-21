import {
  Column, Entity, ManyToOne, OneToMany, PrimaryColumn,
} from 'typeorm';
import { DiscordUser } from './DiscordUser';
import { MbtiAnswer } from './MbtiAnswer';

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

  @Column({ name: 'E', default: 0 })
    E: number;

  @Column({ name: 'I', default: 0 })
    I: number;

  @Column({ name: 'N', default: 0 })
    N: number;

  @Column({ name: 'S', default: 0 })
    S: number;

  @Column({ name: 'T', default: 0 })
    T: number;

  @Column({ name: 'F', default: 0 })
    F: number;

  @Column({ name: 'J', default: 0 })
    J: number;

  @Column({ name: 'P', default: 0 })
    P: number;

  @Column({ nullable: true })
    completedAt?: Date;

  @OneToMany(
    () => MbtiAnswer,
    (answer) => answer.test,
    { cascade: ['insert'] },
  )
    answers: MbtiAnswer[];
}
