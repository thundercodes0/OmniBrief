/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffdf5',
          100: '#fef7da',
          200: '#fdeeb0',
          300: '#f9db7b',
          400: '#f3c448',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
          950: '#2a0f02',
        },
      },
    },
  },
  plugins: [],
}
