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
        myBlue: "#5263fa",
        myPink: "#000000",
        mySecondary: "#4c4c4c",
        myPrimary1: "#2b3699",
        myPrimary2: "#004e92",
        mySecondary1: "#2C3E50",
        mySecondary2: "#000000",
        hoverColor1: "#080807",
      },
    },
  },
  plugins: [],
};
