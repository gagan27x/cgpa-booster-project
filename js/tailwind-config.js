tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Mint Green & Sage theme accents
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981', // Mint Green
          600: '#059669', // Emerald/Mint Accent
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Custom background colors to make sure light and dark mode are fully correct
        mint: {
          light: '#f4fbf7',       // Mint-tint light background
          dark: '#0a0f0d',        // Deep forest green-black background
          cardLight: '#ffffff',   // White cards
          cardDark: '#121916',    // Dark sage cards
          borderLight: '#e6f4ed', // Light minty borders
          borderDark: '#1d2a24',  // Dark minty borders
        }
      },
      boxShadow: {
        'mint-sm': '0 1px 2px 0 rgba(4, 120, 87, 0.03)',
        'mint-md': '0 4px 6px -1px rgba(4, 120, 87, 0.05), 0 2px 4px -1px rgba(4, 120, 87, 0.03)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  }
}
