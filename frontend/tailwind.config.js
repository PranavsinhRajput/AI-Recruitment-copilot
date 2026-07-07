/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-text)",
        slatepanel: "var(--color-sidebar)",
        mint: "var(--color-accent)",
        gold: "#d99a2b",
        berry: "#b44866",
        app: "var(--color-app)",
        panel: "var(--color-panel)",
        elevated: "var(--color-elevated)",
        muted: "var(--color-muted)",
        line: "var(--color-line)",
        softaccent: "var(--color-soft-accent)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        button: "var(--shadow-button)",
      },
    },
  },
  plugins: [],
};
