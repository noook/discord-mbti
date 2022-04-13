import {
  Column, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { Dichotomy } from 'types/mbti';
import { MbtiTest } from './MbtiTest';

@Entity()
export class MbtiAnswer {
  @PrimaryColumn({ generated: 'uuid', type: 'uuid' })
    id: string;

  @Column()
    pairId: number;

  @ManyToOne(
    () => MbtiTest,
    (test) => test.answers,
    { onDelete: 'CASCADE' },
  )
    test: MbtiTest;

  @Column()
    step: number;

  @Column({ nullable: true })
    value?: Dichotomy;
}
