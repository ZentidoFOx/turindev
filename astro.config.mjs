// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    adapter: vercel({
        webAnalytics: {
            enabled: false, // Disabled to avoid 404 errors and improve performance
        }
    }),
    vite: {
        // @ts-ignore - Temporary ignore for Tailwind plugin compatibility
        plugins: [tailwindcss()],
    },
});
