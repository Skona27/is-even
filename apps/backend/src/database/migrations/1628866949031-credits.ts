import { MigrationInterface, QueryRunner } from 'typeorm';

export class credits1628866949031 implements MigrationInterface {
  name = 'credits1628866949031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "credit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "limit" integer NOT NULL, "usage" integer NOT NULL, "from_date" TIMESTAMP NOT NULL, "to_date" TIMESTAMP NOT NULL, "user_id" uuid, CONSTRAINT "PK_c98add8e192ded18b69c3e345a5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "credit" ADD CONSTRAINT "FK_3544cc02a1d516135f1c265026f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "credit" DROP CONSTRAINT "FK_3544cc02a1d516135f1c265026f"`,
    );
    await queryRunner.query(`DROP TABLE "credit"`);
  }
}
