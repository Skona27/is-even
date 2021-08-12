import { MigrationInterface, QueryRunner } from 'typeorm';

export class credits1628794174956 implements MigrationInterface {
  name = 'credits1628794174956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "credit" DROP COLUMN "from_date"`);
    await queryRunner.query(
      `ALTER TABLE "credit" ADD "from_date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "credit" DROP COLUMN "to_date"`);
    await queryRunner.query(
      `ALTER TABLE "credit" ADD "to_date" TIMESTAMP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "credit" DROP COLUMN "to_date"`);
    await queryRunner.query(`ALTER TABLE "credit" ADD "to_date" date NOT NULL`);
    await queryRunner.query(`ALTER TABLE "credit" DROP COLUMN "from_date"`);
    await queryRunner.query(
      `ALTER TABLE "credit" ADD "from_date" date NOT NULL`,
    );
  }
}
