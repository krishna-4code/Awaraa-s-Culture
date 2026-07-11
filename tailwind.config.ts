import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        charcoal: {
          DEFAULT: "#1E1A17", // Midnight Charcoal
        },
        umber: {
          DEFAULT: "#4A4036", // Weathered Umber
        },
        sand: {
          DEFAULT: "#A38C76", // Dusk Sand
        },
        dust: {
          DEFAULT: "#E8DFD5", // Bleached Dust
        },
        clay: {
          DEFAULT: "#8E4A2F", // Canyon Clay
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        display: ["var(--font-syne)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
