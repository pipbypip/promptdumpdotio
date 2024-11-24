export const theme = {
  colors: {
    // Dark theme
    dark: {
      primary: '#6B46C1', // Deep purple
      secondary: '#9F7AEA', // Lighter purple
      background: '#1A202C', // Dark background
      surface: '#2D3748', // Slightly lighter background
      text: '#FFFFFF',
      textSecondary: '#A0AEC0',
      accent: '#805AD5', // Purple accent
      border: '#4A5568',
    },
    // Light theme
    light: {
      primary: '#6B46C1',
      secondary: '#9F7AEA',
      background: '#F7FAFC',
      surface: '#FFFFFF',
      text: '#2D3748',
      textSecondary: '#4A5568',
      accent: '#805AD5',
      border: '#E2E8F0',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    retro: '3px 3px 0 rgba(0, 0, 0, 0.8)', // Pixel-perfect retro shadow
  },
  typography: {
    fontFamily: {
      sans: ['Fira Code', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  gradients: {
    purple: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)',
    accent: 'linear-gradient(135deg, #9F7AEA 0%, #6B46C1 100%)',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },
};
