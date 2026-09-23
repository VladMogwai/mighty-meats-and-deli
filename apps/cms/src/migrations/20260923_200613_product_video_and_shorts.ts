import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_shorts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "products" ADD COLUMN "video_id" integer;
  ALTER TABLE "products" ADD COLUMN "link_label" varchar;
  ALTER TABLE "products" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages_blocks_shorts" ADD CONSTRAINT "pages_blocks_shorts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_shorts_order_idx" ON "pages_blocks_shorts" USING btree ("_order");
  CREATE INDEX "pages_blocks_shorts_parent_id_idx" ON "pages_blocks_shorts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_shorts_path_idx" ON "pages_blocks_shorts" USING btree ("_path");
  ALTER TABLE "products" ADD CONSTRAINT "products_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_video_idx" ON "products" USING btree ("video_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_shorts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_shorts" CASCADE;
  ALTER TABLE "products" DROP CONSTRAINT "products_video_id_videos_id_fk";
  
  DROP INDEX "products_video_idx";
  ALTER TABLE "products" DROP COLUMN "video_id";
  ALTER TABLE "products" DROP COLUMN "link_label";
  ALTER TABLE "products" DROP COLUMN "link_url";`)
}
