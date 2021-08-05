import { MigrationInterface, QueryRunner } from 'typeorm';

export class apiKeys1628186131718 implements MigrationInterface {
  name = 'apiKeys1628186131718';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "api_key" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "value" character varying(50) NOT NULL, "last_used" TIMESTAMP, "user_id" uuid, CONSTRAINT "UQ_4b0873b633484d5de20b2d8f852" UNIQUE ("value"), CONSTRAINT "PK_b1bd840641b8acbaad89c3d8d11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_key" ADD CONSTRAINT "FK_6a0830f03e537b239a53269b27d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "api_key" DROP CONSTRAINT "FK_6a0830f03e537b239a53269b27d"`,
    );
    await queryRunner.query(`DROP TABLE "api_key"`);
  }
}
