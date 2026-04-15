import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "0.75rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', "system-ui", "monospace"],
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
        mono: ['"Inter"', "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        type: {
          normal: "#A8A77A",
          fire: "#EE8130",
          water: "#6390F0",
          electric: "#F7D02C",
          grass: "#7AC74C",
          ice: "#96D9D6",
          fighting: "#C22E28",
          poison: "#A33EA1",
          ground: "#E2BF65",
          flying: "#A98FF3",
          psychic: "#F95587",
          bug: "#A6B91A",
          rock: "#B6A136",
          ghost: "#735797",
          dragon: "#6F35FC",
          dark: "#705746",
          steel: "#B7B7CE",
          fairy: "#D685AD",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
    },
  },
  plugins: [animate],
};
