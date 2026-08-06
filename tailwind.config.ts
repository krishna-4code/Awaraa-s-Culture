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
        dark: {
          bg: "#0B0B0B",
          secondary: "#161616",
          surface: "#1D1D1D",
        },
        warm: {
          white: "#F8F7F4",
        },
        muted: {
          grey: "#9B9B9B",
        },
        gold: {
          accent: "#C5A059",
          muted: "rgba(197, 160, 89, 0.2)",
        },
        charcoal: {
          DEFAULT: "#0B0B0B",
        },
        umber: {
          DEFAULT: "#1D1D1D",
        },
        sand: {
          DEFAULT: "#9B9B9B",
        },
        dust: {
          DEFAULT: "#F8F7F4",
        },
        clay: {
          DEFAULT: "#C5A059",
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
