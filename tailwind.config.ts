import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Asad Sticker & Auto Zone palette — pulled straight off the logo:
        // deep navy shield, chrome/silver lettering, orange "AUTO ZONE" accent.
        brand: {
          navy: "#12294D", // shield body — primary dark surface
          blue: "#1E4A85", // wing mid-blue — links, borders, headings
          steel: "#2E6FB7", // wing highlight blue — active/focus states
          orange: "#E08A4A", // primary accent (AUTO ZONE lettering)
          copper: "#C4703A", // deeper accent for gradient depth / hover
          silver: "#C3CCD6", // chrome mid-tone (dividers on dark)
          chrome: "#EEF2F6", // chrome highlight
          dark: "#0E1B33", // text / outlines (navy-black)
          night: "#091426", // dark backgrounds (hero, footer)
          mist: "#F1F4F8", // light backdrop
          // The logo PNG is not transparent — it carries its own light-gray
          // gradient backdrop (#E6EAEB → #F5F7F6, sampled from the file). Any
          // surface the logo sits on must use these, or you get a visible
          // rectangular seam around the artwork.
          logobg: "#EDF0F1",
          logobgEdge: "#E6EAEB",
          // legacy aliases so the existing `brand-yellow/gold/amber/pink/
          // magenta/purple` classes remap into the navy/orange scheme
          // instead of breaking.
          yellow: "#E08A4A",
          gold: "#F0A868",
          amber: "#C4703A",
          pink: "#E08A4A",
          magenta: "#C4703A",
          purple: "#1E4A85",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-baloo)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #F0A868 0%, #E08A4A 55%, #C4703A 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, #F0A868 0%, #E08A4A 100%)",
        // navy shield gradient — for dark hero/section surfaces
        "brand-navy-gradient":
          "linear-gradient(135deg, #1E4A85 0%, #12294D 60%, #091426 100%)",
        // chrome sweep — mirrors the silver "ASAD" lettering
        "brand-chrome":
          "linear-gradient(135deg, #EEF2F6 0%, #C3CCD6 45%, #8E9CAB 100%)",
      },
      boxShadow: {
        brand: "0 10px 40px -10px rgba(224, 138, 74, 0.55)",
        navy: "0 10px 40px -10px rgba(18, 41, 77, 0.5)",
        card: "0 4px 24px -6px rgba(14, 27, 51, 0.15)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
