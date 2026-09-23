import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    // Test files share one database — run them one at a time
    fileParallelism: false,
    include: ['tests/int/**/*.int.spec.ts'],
  },
})
