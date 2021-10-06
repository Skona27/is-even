import { MigrationInterface, QueryRunner } from 'typeorm';

export class paymentsAndOrderStatus1632933162384 implements MigrationInterface {
  name = 'paymentsAndOrderStatus1632933162384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_28c756d4fd41223fedfbd2750e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "UQ_28c756d4fd41223fedfbd2750e1"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "payment_id"`);
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "UQ_627693d5c743c08684ac0306a4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP COLUMN "payment_provider_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "session_id" character varying(128) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "UQ_a1a91b20f7f3b1e5afb5485cbcd" UNIQUE ("session_id")`,
    );
    await queryRunner.query(
      `CREATE TYPE "payment_status_enum" AS ENUM('Pending', 'Successful', 'Failed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "status" "payment_status_enum" NOT NULL DEFAULT 'Pending'`,
    );
    await queryRunner.query(
      `ALTER TYPE "order_status_enum" RENAME TO "order_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "order_status_enum" AS ENUM('Created', 'Cancelled', 'Fulfilled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" TYPE "order_status_enum" USING "status"::"text"::"order_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'Created'`,
    );
    await queryRunner.query(`DROP TYPE "order_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_f5221735ace059250daac9d9803"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "REL_f5221735ace059250daac9d980"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_f5221735ace059250daac9d9803" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_f5221735ace059250daac9d9803"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "REL_f5221735ace059250daac9d980" UNIQUE ("order_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_f5221735ace059250daac9d9803" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TYPE "order_status_enum_old" AS ENUM('Created', 'PaymentPending', 'PaymentSuccessful', 'PaymentFailed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" TYPE "order_status_enum_old" USING "status"::"text"::"order_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'Created'`,
    );
    await queryRunner.query(`DROP TYPE "order_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "order_status_enum_old" RENAME TO "order_status_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "payment_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "UQ_a1a91b20f7f3b1e5afb5485cbcd"`,
    );
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "session_id"`);
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "payment_provider_id" character varying(40) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "UQ_627693d5c743c08684ac0306a4f" UNIQUE ("payment_provider_id")`,
    );
    await queryRunner.query(`ALTER TABLE "order" ADD "payment_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "UQ_28c756d4fd41223fedfbd2750e1" UNIQUE ("payment_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_28c756d4fd41223fedfbd2750e1" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
