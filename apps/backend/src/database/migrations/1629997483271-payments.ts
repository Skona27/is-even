import { MigrationInterface, QueryRunner } from 'typeorm';

export class payments1629997483271 implements MigrationInterface {
  name = 'payments1629997483271';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "payment_provider_id" character varying(40) NOT NULL, "user_id" uuid, "order_id" uuid, CONSTRAINT "UQ_627693d5c743c08684ac0306a4f" UNIQUE ("payment_provider_id"), CONSTRAINT "REL_f5221735ace059250daac9d980" UNIQUE ("order_id"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "order" ADD "payment_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "UQ_28c756d4fd41223fedfbd2750e1" UNIQUE ("payment_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_c66c60a17b56ec882fcd8ec770b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_f5221735ace059250daac9d9803" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_28c756d4fd41223fedfbd2750e1" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_28c756d4fd41223fedfbd2750e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_f5221735ace059250daac9d9803"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_c66c60a17b56ec882fcd8ec770b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "UQ_28c756d4fd41223fedfbd2750e1"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "payment_id"`);
    await queryRunner.query(`DROP TABLE "payment"`);
  }
}
