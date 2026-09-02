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
        // Bright/Playful CPG Brand Tokens (explore/bright-genre)
        bright: {
          canvas: "#FFFDF6",
          card: "#F4EFE6",
          amber: "#FF5E1E",
          lime: "#88C057",
          coral: "#FF6B8B",
          sun: "#FDE047",
          ink: "#111827",
          muted: "#6B7280",
          border: "#E5E0D4",
        },
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
        mono: ["var(--font-mono)", "monospace"],
        accent: ["var(--font-bricolage)", "sans-serif"],
      },
      animation: {
        "marquee-infinite": "marquee 22s linear infinite",
        "sticker-float": "float 3.5s ease-in-out infinite",
        "cart-illustration-float": "cartIllustrationFloat 4s ease-in-out infinite",
        "spring-pop": "springPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "slideInRight": "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fadeIn": "fadeIn 0.2s ease-out forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(1.5deg)" },
        },
        cartIllustrationFloat: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" },
        },
        springPop: {
          "0%": { transform: "scale(0.94)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
