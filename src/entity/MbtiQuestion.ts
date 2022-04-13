import {
  Entity, Column, PrimaryColumn,
} from 'typeorm';
import { TranslatorLangs } from '../i18n';
import { Dichotomy } from '../types/mbti';

@Entity()
export class MbtiQuestion {
  @PrimaryColumn({ generated: 'uuid', type: 'uuid' })
    id: string;

  @Column()
    pairId: number;

  @Column({ type: 'enum', enum: TranslatorLangs })
    lang: TranslatorLangs;

  @Column({ type: 'text' })
    content: string;

  @Column()
    value: Dichotomy;
}
