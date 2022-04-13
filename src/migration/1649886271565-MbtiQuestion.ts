import { MigrationInterface, QueryRunner } from 'typeorm';

export class MbtiQuestion1649886271565 implements MigrationInterface {
  name = 'MbtiQuestion1649886271565';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."mbti_question_lang_enum" AS ENUM('fr', 'en')
        `);
    await queryRunner.query(`
            CREATE TABLE "mbti_question" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "pairId" integer NOT NULL,
                "lang" "public"."mbti_question_lang_enum" NOT NULL,
                "content" text NOT NULL,
                "value" character varying NOT NULL,
                CONSTRAINT "PK_eef0caef161e2b4d816713400cf" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "mbti_question"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."mbti_question_lang_enum"
        `);
  }
}
