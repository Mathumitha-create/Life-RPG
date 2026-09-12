import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rpg: {
          bg: "#171A2B",
          panel: "#202642",
          surface: "#2A3150",
          "surface-light": "#363E63",
          border: "#3E4870",
          parchment: "#F3E8D0",
          "parchment-muted": "#CFC3A8",
          amber: "#F4B860",
          "amber-hover": "#E5A84E",
          green: "#67C587",
          violet: "#9B8AFB",
          blue: "#6CA8FF",
          danger: "#E67B7B",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        display: [
          '"Cinzel"',
          '"Press Start 2P"',
          "ui-serif",
          "Georgia",
          "serif",
        ],
      },
      boxShadow: {
        pixel: "0 4px 0 0 rgba(0, 0, 0, 0.4)",
        "pixel-sm": "0 2px 0 0 rgba(0, 0, 0, 0.4)",
        "glow-amber": "0 0 16px rgba(244, 184, 96, 0.35)",
        "glow-violet": "0 0 16px rgba(155, 138, 251, 0.35)",
        "glow-green": "0 0 16px rgba(103, 197, 135, 0.35)",
      },
      animation: {
        "bounce-subtle": "bounce-subtle 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
