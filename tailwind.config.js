/** @type {import('tailwindcss').Config} */
import aspectRatio from "@tailwindcss/aspect-ratio"
import { fontFamily } from "tailwindcss/defaultTheme"
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette"
const defaultTheme = require("tailwindcss/defaultTheme")

const svgToDataUri = require("mini-svg-data-uri")

const colors = require("tailwindcss/colors")

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette")

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"))
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  )

  addBase({
    ":root": newVars,
  })
}

/** @type {import('tailwindcss').Config} */
const config = {
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
    aspectRatio,
    addVariablesForColors,
    addVariablesForColors,
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "bg-grid": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          "bg-grid-small": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          "bg-dot": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
            )}")`,
          }),
        },
        {
          values: flattenColorPalette(theme("backgroundColor")),
          type: "color",
        },
      )
    },
  ],

  // daisyui: {
  //   // themes: [
  //   //   {
  //   //     saasstartertheme: {
  //   //       primary: "#ff00be",
  //   //       "primary-content": "#16000d",
  //   //       secondary: "#9333ea",
  //   //       "secondary-content": "#e8dafe",
  //   //       accent: "#0051e3",
  //   //       "accent-content": "#cedffe",
  //   //       neutral: "#1d1d18",
  //   //       "neutral-content": "#cccccb",
  //   //       "base-100": "#fcfcfc",
  //   //       "base-200": "#dbdbdb",
  //   //       "base-300": "#bbbbbb",
  //   //       "base-content": "#161616",
  //   //       info: "#59abff",
  //   //       "info-content": "#030b16",
  //   //       success: "#00b169",
  //   //       "success-content": "#000c04",
  //   //       warning: "#ff8b00",
  //   //       "warning-content": "#160700",
  //   //       error: "#ff6271",
  //   //       "error-content": "#160304",
  //   //     },
  //   //   },
  //   // ],
  // },
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: ["dark"],
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
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [...fontFamily.sans],
      },
      animation: {
        shimmer: "shimmer 8s infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shimmer-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shimmer-width)) 0",
          },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            p: {
              color: "var(--foreground)",
              fontSize: "0.875rem",
              lineHeight: "1.5rem",
              marginTop: "0.75rem",
              marginBottom: "0.75rem",
            },
          },
        },
      },
    },
  },
}

export default config
