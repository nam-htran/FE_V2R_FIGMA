// tailwind.config.js or tailwind.config.ts
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Cú pháp này cho phép bạn dùng class như font-inter, font-unbounded
        inter: ['var(--font-inter)', 'sans-serif'],
        unbounded: ['var(--font-unbounded)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}