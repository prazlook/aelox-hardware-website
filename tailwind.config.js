/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        // Custom theme colors
        'theme-dark': '#1A1A2E',
        'theme-card': '#2C2C4A',
        'theme-text-primary': '#E0E0E0',
        'theme-text-secondary': '#A0A0A0',
        'theme-accent': '#FFD700',
        'theme-cyan': '#00FFFF',
        'theme-magenta': '#FF00FF',
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
        // Existing startup animations
        'startup-fade-in-scale': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'startup-slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'startup-slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        // New pulse-glow animation for the power button
        'pulse-glow': {
          '0%, 100%': {
            'box-shadow': '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(147, 51, 234, 0.5)',
            'transform': 'scale(1)'
          },
          '50%': {
            'box-shadow': '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(147, 51, 234, 0.8)',
            'transform': 'scale(1.02)'
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Existing startup animations
        'startup-fade-in-scale': 'startup-fade-in-scale 0.6s ease-out forwards',
        'startup-slide-in-left': 'startup-slide-in-left 0.6s ease-out forwards',
        'startup-slide-in-right': 'startup-slide-in-right 0.6s ease-out forwards',
        // New pulse-glow animation
        'pulse-glow': 'pulse-glow 1.5s infinite ease-in-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}