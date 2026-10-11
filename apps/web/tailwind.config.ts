import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/shared/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070D1F",
        surface: {
          50: "#0D152D",
          100: "#111B38",
          200: "#162347",
          300: "#1E2F5E",
          border: "rgba(255, 255, 255, 0.08)",
        },
        primary: {
          DEFAULT: "#1F5FFF",
          hover: "#184CCC",
          light: "#4D82FF",
        },
        accent: {
          cyan: "#22D3EE",
          violet: "#7C5CFF",
          purple: "#A855F7",
        },
        verified: {
          DEFAULT: "#16B26B",
          glow: "rgba(22, 178, 107, 0.2)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "ai-glow": "linear-gradient(135deg, rgba(31, 95, 255, 0.15) 0%, rgba(124, 92, 255, 0.15) 50%, rgba(34, 211, 238, 0.1) 100%)",
        "ai-border": "linear-gradient(135deg, rgba(31, 95, 255, 0.4), rgba(124, 92, 255, 0.3), rgba(34, 211, 238, 0.2))",
      },
      boxShadow: {
        "ai-card": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "ai-glow": "0 0 25px -5px rgba(31, 95, 255, 0.3)",
        "verified-glow": "0 0 20px -3px rgba(22, 178, 107, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
