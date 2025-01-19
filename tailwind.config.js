/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
        "gradient-hero": "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
        "gradient-page": "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)",
        "gradient-text": "linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)",
      },
      colors: {},
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
