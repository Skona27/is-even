import { MigrationInterface, QueryRunner } from 'typeorm';

export class user1627407734939 implements MigrationInterface {
  name = 'user1627407734939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "auth_id" character varying(40) NOT NULL, "email" character varying(255) NOT NULL, "first_name" character varying(80), "last_name" character varying(80), CONSTRAINT "UQ_56d00ec31dc3eed1c3f6bff4f58" UNIQUE ("auth_id"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
