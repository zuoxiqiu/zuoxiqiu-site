// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.zuoxiqiu.com',
  output: 'static',
  vite: {
    plugins: [tailwindcss({
      theme: {
        extend: {
          fontFamily: {
            'serif': ['"Playfair Display"', '"Noto Serif SC"', 'serif'],
            'sans': ['"Inter"', '"Noto Sans SC"', 'sans-serif'],
          },
          colors: {
            'ink': '#1a1a1a',
            'stone': '#f5f5f4',
            'mist': '#e7e5e4',
          },
          boxShadow: {
            'glass': '0 4px 30px rgba(0, 0, 0, 0.05)',
            'soft': '0 10px 40px -10px rgba(0,0,0,0.1)',
          },
          letterSpacing: {
            'wide': '0.05em',
          }
        }
      }
    })]
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  }
});
