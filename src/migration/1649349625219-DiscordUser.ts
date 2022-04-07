import { MigrationInterface, QueryRunner } from 'typeorm';

export class DiscordUser1649349625219 implements MigrationInterface {
  name = 'DiscordUser1649349625219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "discord_user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "discordId" character varying NOT NULL,
                "tag" character varying NOT NULL,
                "locale" character varying,
                "lastActive" TIMESTAMP NOT NULL,
                CONSTRAINT "PK_2c465db058d41ca3a50f819b0a1" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "discord_user"
        `);
  }
}
