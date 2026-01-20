import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAiTable1768745185434 implements MigrationInterface {
    name = 'CreateAiTable1768745185434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ai" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "notifications" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_ae9dd2406873944373f167a22f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c5d55852810417bb80c1d2e6b6" ON "ai" ("userId") `);
        await queryRunner.query(`ALTER TABLE "ai" ADD CONSTRAINT "FK_c5d55852810417bb80c1d2e6b6a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ai" DROP CONSTRAINT "FK_c5d55852810417bb80c1d2e6b6a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c5d55852810417bb80c1d2e6b6"`);
        await queryRunner.query(`DROP TABLE "ai"`);
    }

}
