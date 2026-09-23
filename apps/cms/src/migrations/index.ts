import * as migration_20260923_175904_initial from './20260923_175904_initial';
import * as migration_20260923_184855_storage_fields from './20260923_184855_storage_fields';
import * as migration_20260923_200613_product_video_and_shorts from './20260923_200613_product_video_and_shorts';
import * as migration_20260923_202128_category_image from './20260923_202128_category_image';

export const migrations = [
  {
    up: migration_20260923_175904_initial.up,
    down: migration_20260923_175904_initial.down,
    name: '20260923_175904_initial',
  },
  {
    up: migration_20260923_184855_storage_fields.up,
    down: migration_20260923_184855_storage_fields.down,
    name: '20260923_184855_storage_fields',
  },
  {
    up: migration_20260923_200613_product_video_and_shorts.up,
    down: migration_20260923_200613_product_video_and_shorts.down,
    name: '20260923_200613_product_video_and_shorts',
  },
  {
    up: migration_20260923_202128_category_image.up,
    down: migration_20260923_202128_category_image.down,
    name: '20260923_202128_category_image'
  },
];
