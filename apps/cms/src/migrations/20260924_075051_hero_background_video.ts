import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero" ADD COLUMN "background_video_id" integer;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "background_poster_id" integer;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_video_id_media_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_poster_id_media_id_fk" FOREIGN KEY ("background_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_background_video_idx" ON "pages_blocks_hero" USING btree ("background_video_id");
  CREATE INDEX "pages_blocks_hero_background_poster_idx" ON "pages_blocks_hero" USING btree ("background_poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero" DROP CONSTRAINT "pages_blocks_hero_background_video_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_hero" DROP CONSTRAINT "pages_blocks_hero_background_poster_id_media_id_fk";
  
  DROP INDEX "pages_blocks_hero_background_video_idx";
  DROP INDEX "pages_blocks_hero_background_poster_idx";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "background_video_id";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "background_poster_id";`)
}
