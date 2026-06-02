export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b8fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      boxShadow: {
        soft:  '0 4px 24px rgba(15,23,42,0.07)',
        glow:  '0 0 24px rgba(99,102,241,0.25)',
        card:  '0 1px 3px rgba(15,23,42,0.08), 0 8px 32px rgba(15,23,42,0.05)',
        panel: '0 2px 8px rgba(15,23,42,0.12)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        'dark-gradient':  'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.35s cubic-bezier(.22,1,.36,1)',
        'slide-in':   'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow':  'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: 0, transform: 'translateX(-8px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
