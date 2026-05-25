import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true, // This enables global APIs like 'test', 'describe', 'expect'
        // Other Vitest configurations
    },
    // Other Vite configurations if applicable
});