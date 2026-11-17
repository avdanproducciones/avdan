import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://avdan-bay.vercel.app',
  trailingSlash: 'always',
  integrations: [react()],
  output: 'static',
});
