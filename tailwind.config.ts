import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d8ecff",
          500: "#2f80ed",
          700: "#1c63bc",
          900: "#11407f"
        }
      }
    }
  },
  plugins: []
};

export default config;
