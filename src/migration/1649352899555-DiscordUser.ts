import { MigrationInterface, QueryRunner } from 'typeorm';

export class DiscordUser1649352899555 implements MigrationInterface {
  name = 'DiscordUser1649352899555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "discord_user" DROP COLUMN "locale"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."discord_user_locale_enum" AS ENUM('fr', 'en')
        `);
    await queryRunner.query(`
            ALTER TABLE "discord_user"
            ADD "locale" "public"."discord_user_locale_enum"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "discord_user" DROP COLUMN "locale"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."discord_user_locale_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "discord_user"
            ADD "locale" character varying
        `);
  }
}
