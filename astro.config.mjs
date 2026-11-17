import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://avdan-bay.vercel.app',
  trailingSlash: 'always',
  integrations: [react()],
  output: 'static',
  markdown: { syntaxHighlight: false },
  build: { inlineStylesheets: 'always' },
  security: {
    csp: {
      scriptDirective: { strictDynamic: true },
      // Animated elements and React dialogs set style attributes at runtime.
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
      directives: ["object-src 'none'", "base-uri 'self'"],
    },
  },
});
