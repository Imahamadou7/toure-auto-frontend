export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: { 50: '#fdfbf7', 100: '#faf5ec', 200: '#f3ead6' },
        copper: { 400: '#f0a872', 500: '#e89255', 600: '#d97a3b', 700: '#b8612a' },
        ink: { 800: '#2a2522', 900: '#1a1614' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: { soft: '0 8px 30px -10px rgba(217, 122, 59, 0.25)' },
    },
  },
  plugins: [],
};
