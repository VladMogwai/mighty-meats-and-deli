import * as migration_20260923_175904_initial from './20260923_175904_initial';
import * as migration_20260923_184855_storage_fields from './20260923_184855_storage_fields';

export const migrations = [
  {
    up: migration_20260923_175904_initial.up,
    down: migration_20260923_175904_initial.down,
    name: '20260923_175904_initial',
  },
  {
    up: migration_20260923_184855_storage_fields.up,
    down: migration_20260923_184855_storage_fields.down,
    name: '20260923_184855_storage_fields'
  },
];
