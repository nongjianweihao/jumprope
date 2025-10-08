import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          secondary: 'var(--brand-secondary)',
          success: 'var(--brand-success)',
          warning: 'var(--brand-warning)',
          danger: 'var(--brand-danger)'
        },
        panel: 'var(--panel)'
      },
      animation: {
        glow: 'glow 3s ease-in-out infinite'
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 40px rgba(74,108,247,0.25)' },
          '50%': { boxShadow: '0 0 60px rgba(148,93,255,0.45)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
