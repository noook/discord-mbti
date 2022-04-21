import { MigrationInterface, QueryRunner } from 'typeorm';

export class MbtiTestDichotomyCasing1650555320169 implements MigrationInterface {
  name = 'MbtiTestDichotomyCasing1650555320169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "e"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "i"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "n"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "s"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "t"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "f"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "j"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "p"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "E" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "I" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "N" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "S" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "T" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "F" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "J" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "P" integer NOT NULL DEFAULT '0'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "P"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "J"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "F"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "T"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "S"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "N"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "I"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test" DROP COLUMN "E"
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "p" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "j" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "f" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "t" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "s" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "n" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "i" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "mbti_test"
            ADD "e" integer NOT NULL DEFAULT '0'
        `);
  }
}
