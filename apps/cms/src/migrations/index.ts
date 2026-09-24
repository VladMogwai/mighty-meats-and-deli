import * as migration_20260923_175904_initial from './20260923_175904_initial';
import * as migration_20260923_184855_storage_fields from './20260923_184855_storage_fields';
import * as migration_20260923_200613_product_video_and_shorts from './20260923_200613_product_video_and_shorts';
import * as migration_20260923_202128_category_image from './20260923_202128_category_image';
import * as migration_20260923_204453_youtube_channel from './20260923_204453_youtube_channel';
import * as migration_20260924_075051_hero_background_video from './20260924_075051_hero_background_video';

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
    name: '20260923_202128_category_image',
  },
  {
    up: migration_20260923_204453_youtube_channel.up,
    down: migration_20260923_204453_youtube_channel.down,
    name: '20260923_204453_youtube_channel',
  },
  {
    up: migration_20260924_075051_hero_background_video.up,
    down: migration_20260924_075051_hero_background_video.down,
    name: '20260924_075051_hero_background_video'
  },
];
