import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./(components)/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        "be-vietnam-pro": ["var(--font-be-vietnam-pro)"],
        roboto: ["var(--font-roboto)"],
      },
      colors: {
        'stone-50': '#FAFAF9',
        'neutral-100': '#F5F5F5',
        'neutral-900': '#171717',
        'gray-800': '#262626',
        'blue-800': '#1E40AF',
        'blue-900': '#1E3A8A',
        'yellow-400': '#FBBF24',
        'card-bg': '#D6D8E5',
        'footer-blue': '#E9EFFE',
      },
      backgroundImage: {
        "linear-95": "linear-gradient(95deg, var(--tw-gradient-stops))",
        "linear-65": "linear-gradient(65deg, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'custom': '0px 0px 2.2px 1px rgba(76, 76, 76, 0.22)',
      },
    },
  },
  plugins: [],
};
export default config;