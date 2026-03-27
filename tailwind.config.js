/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  "#fdfbf0",
          100: "#f9f2d0",
          200: "#f2e39a",
          300: "#e8ce5f",
          400: "#dcb82e",
          500: "#c9a227",   // primary gold
          600: "#a8811d",
          700: "#856318",
          800: "#634a14",
          900: "#40300d",
        },
        charcoal: {
          50:  "#f4f4f5",
          100: "#e4e4e7",
          200: "#c4c4ca",
          300: "#a0a0ab",
          400: "#70707f",
          500: "#52525f",   // mid-tone
          600: "#3f3f4a",
          700: "#2d2d38",
          800: "#1c1c26",   // primary dark
          900: "#0f0f18",   // deepest bg
        },
        cream: {
          50:  "#fefefe",
          100: "#fdf8f2",
          200: "#f9ede0",
          300: "#f4dec9",
          400: "#eccfb0",
          500: "#e2be96",   // warm cream
        },
        ink: "#1a1a2e",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
