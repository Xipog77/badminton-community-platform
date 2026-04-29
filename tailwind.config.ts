import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#fdfbf7",
        ink: "#2d2d2d",
        mutedPaper: "#e5e0d8",
        marker: "#ff4d4d",
        pen: "#2d5da1"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Kalam", "cursive"],
        body: ["var(--font-body)", "Patrick Hand", "cursive"]
      },
      boxShadow: {
        sketch: "4px 4px 0px 0px #2d2d2d",
        "sketch-lg": "8px 8px 0px 0px #2d2d2d",
        "sketch-press": "2px 2px 0px 0px #2d2d2d"
      },
      keyframes: {
        bob: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        bob: "bob 3s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
