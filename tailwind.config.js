/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        noir: "#050505",
        or: "#D4AF37",
        creme: "#F7F2E8",
      },
      boxShadow: {
        luxe: "0 20px 45px rgba(212, 175, 55, 0.15)",
      },
      backgroundImage: {
        hero:
          "radial-gradient(circle at top left, rgba(212, 175, 55, 0.22), transparent 32%), linear-gradient(180deg, #050505 0%, #101010 60%, #161616 100%)",
      },
    },
  },
  plugins: [],
};
