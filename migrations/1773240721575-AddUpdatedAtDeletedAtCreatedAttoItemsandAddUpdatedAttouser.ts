import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUpdatedAtDeletedAtCreatedAttoItemsandAddUpdatedAttouser1773240721575 implements MigrationInterface {
    name = 'AddUpdatedAtDeletedAtCreatedAttoItemsandAddUpdatedAttouser1773240721575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "item" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "item" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "deletedAt"`);
    }

}
