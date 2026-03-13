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
            'sans': ['"Inter"', '"Noto Sans SC"', 'sans-serif'],
          },
          colors: {
            'void': '#0a0a0a',
            'charcoal': '#141414',
            'surface': '#1c1c1c',
            'glow-blue': 'rgba(59, 130, 246, 0.5)',
            'glow-purple': 'rgba(139, 92, 246, 0.5)',
          },
          boxShadow: {
            'glow': '0 0 60px rgba(59, 130, 246, 0.3), 0 0 100px rgba(139, 92, 246, 0.2)',
            'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
          },
          backgroundImage: {
            'gradient-radial': 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.15), transparent 50%), radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.15), transparent 50%)',
          }
        }
      }
    })]
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
