import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToItemsAiMealTimeAndMealTimeUuid1773549569641 implements MigrationInterface {
    name = 'AddUserIdToItemsAiMealTimeAndMealTimeUuid1773549569641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_5369db3bd33839fd3b0dd5525d1"`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meal_time" DROP CONSTRAINT "FK_1f4f667477536a233c01df9f569"`);
        await queryRunner.query(`ALTER TABLE "meal_time" DROP CONSTRAINT "PK_ad3796db778ca6e86f5b741619c"`);
        await queryRunner.query(`ALTER TABLE "meal_time" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "meal_time" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "meal_time" ADD CONSTRAINT "PK_ad3796db778ca6e86f5b741619c" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "meal_time" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ai" DROP CONSTRAINT "FK_c5d55852810417bb80c1d2e6b6a"`);
        await queryRunner.query(`ALTER TABLE "ai" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_5369db3bd33839fd3b0dd5525d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meal_time" ADD CONSTRAINT "FK_1f4f667477536a233c01df9f569" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ai" ADD CONSTRAINT "FK_c5d55852810417bb80c1d2e6b6a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ai" DROP CONSTRAINT "FK_c5d55852810417bb80c1d2e6b6a"`);
        await queryRunner.query(`ALTER TABLE "meal_time" DROP CONSTRAINT "FK_1f4f667477536a233c01df9f569"`);
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_5369db3bd33839fd3b0dd5525d1"`);
        await queryRunner.query(`ALTER TABLE "ai" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ai" ADD CONSTRAINT "FK_c5d55852810417bb80c1d2e6b6a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meal_time" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meal_time" DROP CONSTRAINT "PK_ad3796db778ca6e86f5b741619c"`);
        await queryRunner.query(`ALTER TABLE "meal_time" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "meal_time" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meal_time" ADD CONSTRAINT "PK_ad3796db778ca6e86f5b741619c" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "meal_time" ADD CONSTRAINT "FK_1f4f667477536a233c01df9f569" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_5369db3bd33839fd3b0dd5525d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
