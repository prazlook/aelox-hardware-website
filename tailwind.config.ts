import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'theme-dark': '#0A101A',
        'theme-card': '#1A222E',
        'theme-accent': '#00A9B7',
        'theme-cyan': '#00F0FF',
        'theme-text-primary': '#FFFFFF',
        'theme-text-secondary': '#A0AEC0',
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "border-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "aurora": {
          "from": { "background-position": "0% 50%" },
          "to": { "background-position": "200% 50%" },
        },
        "float-particle": {
          "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: "0" },
          "25%, 75%": { opacity: "1" },
          "100%": { transform: "translate(var(--tx), var(--ty)) rotate(360deg)", opacity: "0" },
        },
        typewriter: {
          from: { "clip-path": "polygon(0 0, 0 0, 0 100%, 0 100%)" },
          to: { "clip-path": "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
        },
        "blink-caret": {
          "from, to": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "shutdown-wave": {
          '0%': { strokeDasharray: '0 200', strokeDashoffset: 0 },
          '50%': { strokeDasharray: '100 100', strokeDashoffset: -50 },
          '100%': { strokeDasharray: '0 200', strokeDashoffset: -200 },
        },
        "flicker-and-fade": {
          '0%, 100%': { opacity: 1 },
          '10%, 30%, 50%, 70%, 90%': { opacity: 0.6 },
          '20%, 40%, 60%, 80%': { opacity: 1 },
          '95%': { opacity: 0.2 },
        },
        "gentle-shutdown": {
          '0%': { opacity: 1, filter: 'brightness(1)' },
          '100%': { opacity: 0.7, filter: 'brightness(0.8)' },
        },
        "boot-up-item": {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        "slide-in-item": {
          '0%': { opacity: 0, transform: 'translateX(-10px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        "pulse-fast": {
          "50%": { transform: 'scale(1.05)', textShadow: '0 0 8px rgba(253, 224, 71, 0.5)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "border-spin": "border-spin 4s linear infinite",
        "aurora": "aurora 6s ease infinite",
        "float-particle": "float-particle 6s infinite ease-in-out",
        typewriter: "typewriter 0.5s steps(30, end) forwards",
        "shutdown-wave": "shutdown-wave 1.5s ease-in-out forwards",
        "flicker-and-fade": "flicker-and-fade 1.5s ease-out forwards",
        "gentle-shutdown": "gentle-shutdown 1s ease-out forwards",
        "boot-up-item": "boot-up-item 0.5s ease-out forwards",
        "slide-in-item": "slide-in-item 0.3s ease-out forwards",
        "pulse-fast": "pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;