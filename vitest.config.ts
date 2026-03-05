import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
    test: {
        fileParallelism: false, // This will make all test files run sequentially to avoid race conditions in db
        maxWorkers: 1,
        projects: [
            {
                test: {
                    name: 'unit',
                    include: ['test/unit/*.{test,spec}.ts'],
                    environment: 'node'
                }
            },
            {
                test: {
                    name: 'e2e',
                    include: ['test/e2e/*.{test,spec}.ts'],
                    environment: 'node'
                }
            },
            await defineVitestProject({
                test: {
                    name: 'nuxt',
                    include: [
                        'test/nuxt/api/*.{test,spec}.ts',
                        'test/nuxt/middleware/*.{test,spec}.ts'
                    ],
                    setupFiles: ['test/nuxt/setup.ts'],
                    environment: 'nuxt'
                }
            })
        ]
    }
})
