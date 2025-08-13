/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
colors: {
        primary: '#1a365d',
        secondary: '#2d3748',
        accent: '#0059E3',
        surface: '#FFFFFF',
        background: '#f7fafc',
        banner: '#F7F9FB',
        success: '#38a169',
        warning: '#d69e2e',
        error: '#e53e3e',
        info: '#3182ce',
      },
fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
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