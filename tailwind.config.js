/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#FBF8F5',
          100: '#F4ECE4',
          200: '#E7D6C6',
          300: '#D5BAA2',
          400: '#BA9477',
          500: '#9B7153',
          600: '#7E553A',
          700: '#64422D',
          800: '#4A3022',
          900: '#2E1C14',
          950: '#1A0E0A',
        },
        cream: {
          50: '#FFFEFA',
          100: '#FAF7F0',
          200: '#F4EEE0',
          300: '#ECE2CC',
        },
        roast: {
          amber: '#E09F3E',
          caramel: '#C86D27',
          espresso: '#1F110A',
          crema: '#E8CA9D',
          mint: '#3EB489',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Plus Jakarta Sans Fallback', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Playfair Display Fallback', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'steam': 'steam 3s ease-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        steam: {
          '0%': { transform: 'translateY(0px) scale(0.8)', opacity: '0' },
          '50%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-24px) scale(1.3)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
