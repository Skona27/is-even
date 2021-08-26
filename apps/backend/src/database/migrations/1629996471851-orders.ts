import { MigrationInterface, QueryRunner } from 'typeorm';

export class orders1629996471851 implements MigrationInterface {
  name = 'orders1629996471851';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "order_status_enum" AS ENUM('Created', 'PaymentPending', 'PaymentSuccessful', 'PaymentFailed')`,
    );
    await queryRunner.query(
      `CREATE TYPE "order_credit_limit_type_enum" AS ENUM('Free', 'Standard')`,
    );
    await queryRunner.query(
      `CREATE TYPE "order_credit_duration_type_enum" AS ENUM('Monthly')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "price" integer NOT NULL, "status" "order_status_enum" NOT NULL DEFAULT 'Created', "credit_limit_type" "order_credit_limit_type_enum" NOT NULL, "credit_duration_type" "order_credit_duration_type_enum" NOT NULL, "user_id" uuid, "credit_id" uuid, CONSTRAINT "REL_d8625eb6d6e1217afd9ca73cd7" UNIQUE ("credit_id"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_d8625eb6d6e1217afd9ca73cd75" FOREIGN KEY ("credit_id") REFERENCES "credit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_d8625eb6d6e1217afd9ca73cd75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "order_credit_duration_type_enum"`);
    await queryRunner.query(`DROP TYPE "order_credit_limit_type_enum"`);
    await queryRunner.query(`DROP TYPE "order_status_enum"`);
  }
}
