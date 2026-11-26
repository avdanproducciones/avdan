import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://avdan-bay.vercel.app',
  trailingSlash: 'ignore',
  integrations: [react()],
  output: 'static',
  markdown: { syntaxHighlight: false },
  build: { inlineStylesheets: 'never' },
  security: {
    csp: {
      scriptDirective: {
        strictDynamic: true,
        resources: [{ resource: "'none'", kind: 'attribute' }],
      },
      // Animated elements and React dialogs set style attributes at runtime.
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
      directives: ["object-src 'none'", "base-uri 'self'"],
    },
  },
});
