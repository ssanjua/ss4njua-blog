import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://ss4njua.vercel.app',
  integrations: [
    tailwind({
      config: { applyBaseStyles: false },
    }),
  ],
});