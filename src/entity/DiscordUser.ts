import {
  Entity, Column, PrimaryColumn, OneToMany,
} from 'typeorm';
import { TranslatorLangs } from '../i18n';
import { MbtiTest } from './MbtiTest';

@Entity()
export class DiscordUser {
  @PrimaryColumn({ generated: 'uuid', type: 'uuid' })
    id: string;

  @Column()
    discordId: string;

  @Column()
    tag: string;

  @Column({ nullable: true, type: 'enum', enum: TranslatorLangs })
    locale?: TranslatorLangs;

  @OneToMany(
    () => MbtiTest,
    (test) => test.user,
    { cascade: true, onDelete: 'CASCADE' },
  )
    tests: MbtiTest[];

  @Column()
    lastActive: Date = new Date();
}
