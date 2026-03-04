/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#1e293b',
        'sidebar-hover': '#334155',
        'sidebar-active': '#0f172a',
      },
    },
  },
  plugins: [],
};
