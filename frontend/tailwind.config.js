/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#ecfdf3",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          800: "#14532d",
          900: "#052e16",
          950: "#0a120e",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 197, 94, 0.18)",
      },
    },
  },
  plugins: [],
};
