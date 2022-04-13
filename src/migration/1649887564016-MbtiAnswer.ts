import { MigrationInterface, QueryRunner } from 'typeorm';

export class MbtiAnswer1649887564016 implements MigrationInterface {
  name = 'MbtiAnswer1649887564016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "mbti_answer" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "pairId" integer NOT NULL,
                "step" integer NOT NULL,
                "value" character varying,
                "testId" uuid,
                CONSTRAINT "PK_c3c1f4513db4a4ba58896e47b01" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_answer"
            ADD CONSTRAINT "FK_361741af16784a144cf0246426d" FOREIGN KEY ("testId") REFERENCES "mbti_test"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "mbti_answer" DROP CONSTRAINT "FK_361741af16784a144cf0246426d"
        `);
    await queryRunner.query(`
            DROP TABLE "mbti_answer"
        `);
  }
}
