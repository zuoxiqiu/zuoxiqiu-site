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
            'handwriting': ['"Caveat"', '"Patrick Hand"', 'cursive'],
            'sketch': ['"Comic Neue"', 'cursive'],
          },
          colors: {
            'paper': '#fdfbf7',
            'pencil': '#2d3748',
            'marker-blue': '#4299e1',
            'marker-pink': '#ed64a6',
            'marker-yellow': '#ecc94b',
            'marker-green': '#48bb78',
          },
          boxShadow: {
            'hand-drawn': '2px 3px 0 #000',
            'hand-drawn-hover': '4px 6px 0 #000',
          },
          borderWidth: {
            '3': '3px',
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
