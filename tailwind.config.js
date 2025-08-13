/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C5530',
        secondary: '#8B6F47',
        accent: '#E67E22',
        surface: '#FFFFFF',
        background: '#F8F6F3',
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#3498DB',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'slide': 'slide 20s linear infinite',
        'bounce-in': 'bounce-in 0.6s ease-out',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3) translateY(20px)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1) translateY(0px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}