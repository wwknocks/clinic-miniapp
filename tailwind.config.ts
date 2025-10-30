import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F14",
        panel: "#0F141B",
        glass: "rgba(255, 255, 255, 0.06)",
        text: {
          primary: "#E6EDF3",
          secondary: "#9FB0C3",
          tertiary: "#6B7886",
        },
        accent: {
          DEFAULT: "#8AB4FF",
          light: "#A8C7FF",
          dark: "#6B9FFF",
        },
        danger: {
          DEFAULT: "#FF6B6B",
          light: "#FF8585",
          dark: "#FF5252",
        },
        success: {
          DEFAULT: "#3DDC97",
          light: "#5FFFB1",
          dark: "#2BC380",
        },
        warning: {
          DEFAULT: "#FFD166",
          light: "#FFE599",
          dark: "#FFBC33",
        },
        border: "rgba(255, 255, 255, 0.1)",
      },
      fontSize: {
        "11": ["11px", { lineHeight: "1.5" }],
        "13": ["13px", { lineHeight: "1.5" }],
        "15": ["15px", { lineHeight: "1.5" }],
        "18": ["18px", { lineHeight: "1.5" }],
        "24": ["24px", { lineHeight: "1.3" }],
        "32": ["32px", { lineHeight: "1.2" }],
        "40": ["40px", { lineHeight: "1.1" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        "2xl": "1rem",
        xl: "0.75rem",
      },
      boxShadow: {
        glass:
          "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
        "glass-lg":
          "0 16px 48px 0 rgba(0, 0, 0, 0.5), inset 0 1px 2px 0 rgba(255, 255, 255, 0.1)",
        glow: "0 0 20px rgba(138, 180, 255, 0.3)",
        "glow-accent": "0 0 30px rgba(138, 180, 255, 0.4)",
        "glow-success": "0 0 30px rgba(61, 220, 151, 0.4)",
        "glow-danger": "0 0 30px rgba(255, 107, 107, 0.4)",
      },
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        gradient: "gradient 8s linear infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px rgba(138, 180, 255, 0.3)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 30px rgba(138, 180, 255, 0.5)",
          },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
