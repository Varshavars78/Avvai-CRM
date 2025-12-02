/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#00AEEF',
          50: '#e0f7ff',
          100: '#b3eaff',
          500: '#00AEEF',
          600: '#008cbf',
          700: '#007099',
        },
        success: '#3BCF5A',
        danger: '#FF6B6B',
        
        // Semantic colors for theming
        bg: {
          light: '#FFFFFF',
          dark: '#1C1C1C'
        },
        sidebar: {
          light: '#F7F9FB',
          dark: '#111111'
        },
        card: {
          light: '#FFFFFF',
          dark: '#262626'
        },
        border: {
          light: '#E5E7EB',
          dark: '#3A3A3A'
        },
        txt: {
          primary: { light: '#1F2937', dark: '#FFFFFF' },
          secondary: { light: '#6B7280', dark: '#B3B3B3' }
        }
      }
    }
  },
  plugins: [],
}