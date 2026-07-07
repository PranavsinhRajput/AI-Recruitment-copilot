/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        slatepanel: "#24313f",
        mint: "#15a47f",
        gold: "#d99a2b",
        berry: "#b44866",
      },
      boxShadow: {
        soft: "0 14px 40px rgba(23, 33, 43, 0.12)",
      },
    },
  },
  plugins: [],
};
