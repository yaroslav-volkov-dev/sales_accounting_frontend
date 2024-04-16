/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#d6ddff',
        'button-primary': '#7c72ff',
        'button-primary-disabled': '#d3d3d3'
      },
    },
  },
  plugins: [],
};