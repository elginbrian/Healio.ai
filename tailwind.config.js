/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          75: "var(--color-p-75)",
          100: "var(--color-p-100)",
          200: "var(--color-p-200)",
          300: "var(--color-p-300)",
          400: "var(--color-p-400)",
          500: "var(--color-p-500)",
        },
      },
    },
  },
  plugins: [],
};
