import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ss4njua.vercel.app',
  integrations: [
    tailwind({
      config: { applyBaseStyles: false },
    }), mdx(), react(), sitemap()
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    extendDefaultPlugins: true,
  },
});