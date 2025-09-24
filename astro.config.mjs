// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: vercel({
        webAnalytics: {
            enabled: true,
        },
        speedInsights: {
            enabled: true,
        },
        devMode: false,
        includedFiles: ['**/*'],
        serverless: {
            maxDuration: 60
        }
    }),
    vite: {
        plugins: [tailwindcss()],
    },
});
