/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores primarios modernos
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Acentos modernos para gradientes
        accent: {
          cyan: '#06b6d4',
          purple: '#a855f7',
          pink: '#ec4899',
          orange: '#f97316',
          emerald: '#10b981',
          violet: '#8b5cf6',
        },
        // Dark mode colors
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        // Glassmorphism backgrounds
        glass: {
          light: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(17, 24, 39, 0.7)',
        },
      },
      // Backgrounds con gradientes modernos
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        // Gradientes iridiscentes modernos
        'iridescent': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
        'aurora': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        'sunset': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'ocean': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'emerald': 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)',
        // Mesh gradients (tendencia 2024-2025)
        'mesh-light': 'radial-gradient(at 40% 20%, #3b82f6 0px, transparent 50%), radial-gradient(at 80% 0%, #a855f7 0px, transparent 50%), radial-gradient(at 0% 50%, #ec4899 0px, transparent 50%)',
        'mesh-dark': 'radial-gradient(at 40% 20%, #1e40af 0px, transparent 50%), radial-gradient(at 80% 0%, #6b21a8 0px, transparent 50%), radial-gradient(at 0% 50%, #9f1239 0px, transparent 50%)',
      },
      // Animaciones modernas
      animation: {
        // Animaciones básicas mejoradas
        'spin-slow': 'spin 3s linear infinite',
        'spin-slower': 'spin 6s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',

        // Animaciones avanzadas
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'gradient-y': 'gradient-y 3s ease infinite',
        'gradient-xy': 'gradient-xy 3s ease infinite',
        'tilt': 'tilt 10s infinite linear',

        // Animaciones de entrada modernas
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'fade-in-left': 'fadeInLeft 0.6s ease-out',
        'fade-in-right': 'fadeInRight 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'slide-in-bottom': 'slideInBottom 0.6s ease-out',

        // Animaciones de fondo
        'aurora': 'aurora 20s ease infinite',
        'wave': 'wave 8s ease-in-out infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        // Keyframes básicos
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gradient-y': {
          '0%, 100%': { backgroundPosition: '50% 0%' },
          '50%': { backgroundPosition: '50% 100%' },
        },
        'gradient-xy': {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
        },
        tilt: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },

        // Animaciones de entrada
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInBottom: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },

        // Animaciones de fondo
        aurora: {
          '0%, 100%': {
            backgroundPosition: '50% 50%, 50% 50%',
            filter: 'hue-rotate(0deg)',
          },
          '50%': {
            backgroundPosition: '350% 50%, 350% 50%',
            filter: 'hue-rotate(30deg)',
          },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0%) translateY(0%) rotate(0deg)' },
          '25%': { transform: 'translateX(5%) translateY(-5%) rotate(1deg)' },
          '50%': { transform: 'translateX(0%) translateY(-10%) rotate(0deg)' },
          '75%': { transform: 'translateX(-5%) translateY(-5%) rotate(-1deg)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      },
      // Blur utilities para glassmorphism
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      // Box shadows modernos
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.6)',
        'neon': '0 0 5px theme(colors.primary.400), 0 0 20px theme(colors.primary.600)',
        'neon-pink': '0 0 5px theme(colors.accent.pink), 0 0 20px theme(colors.accent.pink)',
        'neon-purple': '0 0 5px theme(colors.accent.purple), 0 0 20px theme(colors.accent.purple)',
      },
      // Border radius modernos
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // Tamaños de blur
      blur: {
        '4xl': '128px',
      },
      // Spacing adicional
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      // Z-index layers
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      // Background size para animaciones
      backgroundSize: {
        '200%': '200% 200%',
        '300%': '300% 300%',
        '400%': '400% 400%',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
