import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Code split node_modules
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                    // Code split markdown content
                    if (id.includes('content/blogs')) {
                        return 'blog-content';
                    }
                }
            }
        },
        chunkSizeWarningLimit: 1000,
        sourcemap: true
    }
})
