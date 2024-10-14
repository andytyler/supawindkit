/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        saasstartertheme: {
          primary: "#ff00be",
          "primary-content": "#16000d",

          secondary: "#9333ea",

          "secondary-content": "#e8dafe",

          accent: "#0051e3",

          "accent-content": "#cedffe",

          neutral: "#1d1d18",

          "neutral-content": "#cccccb",

          "base-100": "#fcfcfc",

          "base-200": "#dbdbdb",

          "base-300": "#bbbbbb",

          "base-content": "#161616",

          info: "#59abff",
          "info-content": "#030b16",

          success: "#00b169",

          "success-content": "#000c04",

          warning: "#ff8b00",

          "warning-content": "#160700",

          error: "#ff6271",

          "error-content": "#160304",
        },
      },
    ],
  },
}
