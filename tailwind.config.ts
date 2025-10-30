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
        },
        accent: "#8AB4FF",
        danger: "#FF6B6B",
        success: "#3DDC97",
        warning: "#FFD166",
      },
      fontSize: {
        "11": "11px",
        "13": "13px",
        "15": "15px",
        "18": "18px",
        "24": "24px",
        "32": "32px",
        "40": "40px",
      },
      borderRadius: {
        "2xl": "1rem",
        xl: "0.75rem",
      },
      boxShadow: {
        glass:
          "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
      },
      backdropBlur: {
        md: "12px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
