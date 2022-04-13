import { MigrationInterface, QueryRunner } from 'typeorm';

export class MbtiTest1649871947178 implements MigrationInterface {
  name = 'MbtiTest1649871947178';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "mbti_test" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "step" integer NOT NULL,
                "completed" boolean NOT NULL DEFAULT false,
                "result" character(4),
                "e" integer NOT NULL DEFAULT '0',
                "i" integer NOT NULL DEFAULT '0',
                "n" integer NOT NULL DEFAULT '0',
                "s" integer NOT NULL DEFAULT '0',
                "t" integer NOT NULL DEFAULT '0',
                "f" integer NOT NULL DEFAULT '0',
                "j" integer NOT NULL DEFAULT '0',
                "p" integer NOT NULL DEFAULT '0',
                "completedAt" TIMESTAMP,
                "userId" uuid,
                CONSTRAINT "PK_653d1fa12a7fcf8e5fcd520c666" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD CONSTRAINT "FK_e26102d2a1c7d2568bd89a401e1" FOREIGN KEY ("userId") REFERENCES "discord_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP CONSTRAINT "FK_e26102d2a1c7d2568bd89a401e1"
        `);
    await queryRunner.query(`
            DROP TABLE "mbti_test"
        `);
  }
}
