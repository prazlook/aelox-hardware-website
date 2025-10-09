/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
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
        'theme-bg': '#1a1a1a',
        'theme-card': '#242424',
        'theme-accent': '#00ffff', // Cyan
        'theme-text-primary': '#ffffff',
        'theme-text-secondary': '#a0a0a0',
        'theme-cyan': '#00ffff',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "aurora": {
          from: { backgroundPosition: "0% 50%" },
          to: { backgroundPosition: "200% 50%" },
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
        "aurora": "aurora 6s ease infinite",
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
}