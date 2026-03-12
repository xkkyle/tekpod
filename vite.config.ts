import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
	return {
		plugins: [react()],
		server: {},
		build: {
			rollupOptions: {
				output: {
					manualChunks(id: string) {
						// Reducing the vendor chunk size
						// creating a chunk to react routes deps. Reducing the vendor chunk size
						if (id.includes('react-router-dom') || id.includes('@remix-run') || id.includes('react-router')) {
							return '@react-router';
						}

						if (id.includes('supabase/supabase-js')) {
							return '@supabase';
						}

						if (id.includes('framer-motion')) {
							return '@motion';
						}

						if (id.includes('zod')) {
							return '@zod';
						}
					},
				},
			},
		},
	};
});
