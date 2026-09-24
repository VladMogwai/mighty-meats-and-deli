import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_shorts_source" AS ENUM('manual', 'youtube');
  ALTER TABLE "pages_blocks_shorts" ADD COLUMN "source" "enum_pages_blocks_shorts_source" DEFAULT 'manual';
  ALTER TABLE "pages_blocks_shorts" ADD COLUMN "youtube_limit" numeric DEFAULT 10;
  ALTER TABLE "site_settings" ADD COLUMN "youtube_channel" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_shorts" DROP COLUMN "source";
  ALTER TABLE "pages_blocks_shorts" DROP COLUMN "youtube_limit";
  ALTER TABLE "site_settings" DROP COLUMN "youtube_channel";
  DROP TYPE "public"."enum_pages_blocks_shorts_source";`)
}
