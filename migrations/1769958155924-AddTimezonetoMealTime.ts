import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimezonetoMealTime1769958155924 implements MigrationInterface {
    name = 'AddTimezonetoMealTime1769958155924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_time" ADD "timezone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_time" DROP COLUMN "timezone"`);
    }

}
