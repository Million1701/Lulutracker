import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  border: string;
  accent: string;
  primary: string;
}

interface GradientConfig {
  from: string;
  via?: string;
  to: string;
}

interface ThemeConfig {
  theme: 'light' | 'dark';
  isDark: boolean;
  colors: ThemeColors;
  gradients: {
    primary: GradientConfig;
    secondary: GradientConfig;
    accent: GradientConfig;
    aurora: GradientConfig;
    sunset: GradientConfig;
    ocean: GradientConfig;
  };
  glass: {
    background: string;
    border: string;
    shadow: string;
  };
}

/**
 * Hook personalizado para obtener la configuración del tema actual
 * @returns {ThemeConfig} Configuración completa del tema con colores, gradientes y estilos glass
 */
export const useThemeConfig = (): ThemeConfig => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeConfig must be used within a ThemeProvider');
  }

  const { theme } = context;
  const isDark = theme === 'dark';

  return {
    theme,
    isDark,
    colors: {
      background: isDark ? '#111827' : '#ffffff',
      foreground: isDark ? '#f3f4f6' : '#111827',
      card: isDark ? '#1f2937' : '#ffffff',
      cardForeground: isDark ? '#f3f4f6' : '#111827',
      border: isDark ? '#374151' : '#e5e7eb',
      accent: isDark ? '#60a5fa' : '#3b82f6',
      primary: isDark ? '#3b82f6' : '#2563eb',
    },
    gradients: {
      primary: {
        from: isDark ? '#1e40af' : '#3b82f6',
        to: isDark ? '#3b82f6' : '#60a5fa',
      },
      secondary: {
        from: isDark ? '#6b7280' : '#f3f4f6',
        to: isDark ? '#111827' : '#ffffff',
      },
      accent: {
        from: isDark ? '#a855f7' : '#ec4899',
        via: isDark ? '#ec4899' : '#f97316',
        to: isDark ? '#3b82f6' : '#06b6d4',
      },
      aurora: {
        from: '#667eea',
        via: '#764ba2',
        to: '#f093fb',
      },
      sunset: {
        from: '#fa709a',
        to: '#fee140',
      },
      ocean: {
        from: '#4facfe',
        to: '#00f2fe',
      },
    },
    glass: {
      background: isDark ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.7)',
      border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.18)',
      shadow: isDark ? 'rgba(0, 0, 0, 0.37)' : 'rgba(31, 38, 135, 0.37)',
    },
  };
};
