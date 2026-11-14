/** @type {import('tailwindcss').Config} */
const { tokens } = require("../../packages/shared/tokens.js");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "media",
  theme: {
    extend: {
      colors: tokens.color,
      borderRadius: {
        sm: `${tokens.radius.sm}px`,
        md: `${tokens.radius.md}px`,
        lg: `${tokens.radius.lg}px`,
        card: `${tokens.radius.card}px`,
      },
      fontFamily: {
        display: ["Fraunces_600SemiBold"],
        displayBold: ["Fraunces_700Bold"],
        displayItalic: ["Fraunces_500Medium_Italic"],
        body: ["Inter_400Regular"],
        medium: ["Inter_500Medium"],
        semibold: ["Inter_600SemiBold"],
        bold: ["Inter_700Bold"],
      },
    },
  },
  plugins: [],
};
