/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        navy: "#003366",
        cyan: "#00AEEF",
        graylight: "#F7F7F7",
      },
      boxShadow: {
        blueGlow: "0 8px 24px rgba(0, 174, 239, 0.25)",
      },
      animation: {
        clickPop: 'clickPop 200ms ease-out',
      },
      keyframes: {
        clickPop: { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(0.96)' } },
      },
      borderRadius: {
        lg: '8px',
        xl: '1rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
