/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1200px",
      xl: "1440px",
    },
    extend: {
      colors: {
        myBlue: "#6366F1",
        myPink: "#000000",
        mySecondary: "#4c4c4c",
      },
      backgroundImage: (theme) => ({
        pattern: "url('/src/assets/bg1.png')",
      }),
    },
  },
  plugins: [],
};
