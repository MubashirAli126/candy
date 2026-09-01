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
        // Candy palette — a ladies' clothing brand: candy pink primary, deep
        // plum surfaces, soft blush backdrops and a champagne-gold accent.
        brand: {
          pink: "#EE4C89", // primary — buttons, badges, prices
          rose: "#FF7FA8", // lighter pink for gradients / hover
          blush: "#FFD8E6", // soft tint for chips and cards
          plum: "#7A2350", // deep pink-purple — headings on light
          purple: "#A03A73", // secondary accent — links, category labels
          gold: "#E8B44F", // champagne accent (sale, highlights)
          // Logo artwork colours (business card): the red wordmark and the
          // red / green / yellow polka dots behind it.
          logoRed: "#E1252B",
          logoGreen: "#22B24C",
          logoYellow: "#FDC10D",
          dark: "#2B1020", // text / outlines (plum-black)
          night: "#1B0713", // dark backgrounds (hero, footer)
          mist: "#FDF3F7", // light backdrop
          // Surface the logo sits on — keep the header/footer plate matched to
          // the artwork backdrop so no rectangular seam shows.
          logobg: "#FDF3F7",
          logobgEdge: "#F7E6EE",
          // legacy aliases so existing `brand-navy/blue/steel/orange/copper/
          // silver/chrome/yellow/amber/magenta` classes remap into the candy
          // scheme instead of breaking.
          navy: "#7A2350",
          blue: "#A03A73",
          steel: "#C25B96",
          orange: "#EE4C89",
          copper: "#C7326E",
          silver: "#E7C7D6",
          chrome: "#FBEDF3",
          yellow: "#E8B44F",
          amber: "#C7326E",
          magenta: "#C7326E",
        },
      },
      // The stock Tailwind ramp bottoms out at 12px/14px, which reads as fine
      // print on a phone. Lift the small end — every text-xs / text-sm on the
      // site moves with it, so nothing has to be bumped one class at a time.
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.125rem" }], // 13px
        sm: ["0.9375rem", { lineHeight: "1.375rem" }], // 15px
        base: ["1.0625rem", { lineHeight: "1.625rem" }], // 17px
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-baloo)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #FF9DBE 0%, #EE4C89 55%, #C7326E 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, #FFD8E6 0%, #FF9DBE 100%)",
        // deep plum gradient — for dark hero/section surfaces
        "brand-navy-gradient":
          "linear-gradient(135deg, #A03A73 0%, #7A2350 60%, #1B0713 100%)",
        // soft pearl sweep — used for shimmering text on dark plum
        "brand-chrome":
          "linear-gradient(135deg, #FFFFFF 0%, #FFD8E6 45%, #E7C7D6 100%)",
      },
      boxShadow: {
        brand: "0 10px 40px -10px rgba(238, 76, 137, 0.55)",
        navy: "0 10px 40px -10px rgba(122, 35, 80, 0.5)",
        card: "0 4px 24px -6px rgba(43, 16, 32, 0.15)",
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
