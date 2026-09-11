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
        // ──────────────────────────────────────────────────────────────
        // Candy palette — "modern classic": a warm ivory canvas, deep
        // plum-ink type, champagne-gold hairlines for the classic half,
        // and the candy pink kept as the one loud accent for commerce.
        // ──────────────────────────────────────────────────────────────
        brand: {
          // Canvas — everything sits on paper, not on flat white.
          ivory: "#FDFBF8", // page background
          cream: "#F7F1EA", // alternating sections, image beds
          sand: "#EFE5DA", // hairline-adjacent fills, chips
          // Ink — the classic half of the scheme.
          ink: "#25131F", // headings & body on light
          inkSoft: "#5A4551", // secondary copy
          inkMuted: "#8C7A85", // captions, meta, placeholders
          // Champagne gold — rules, ornaments, quiet emphasis.
          gold: "#C0A062",
          goldSoft: "#E4D6B8",
          // Candy accent — buttons, prices, sale flags.
          pink: "#EE4C89", // primary — buttons, badges, prices
          rose: "#FF7FA8", // lighter pink for gradients / hover
          blush: "#FFD8E6", // soft tint for chips and cards
          plum: "#7A2350", // deep pink-purple — headings on light
          purple: "#A03A73", // secondary accent — links, category labels
          // Logo artwork colours (business card): the red wordmark and the
          // red / green / yellow polka dots behind it.
          logoRed: "#E1252B",
          logoGreen: "#22B24C",
          logoYellow: "#FDC10D",
          dark: "#25131F", // text / outlines — now the shared ink
          night: "#1A0C14", // dark surfaces (hero wash, footer)
          mist: "#FBF5F7", // light pink backdrop
          // Surface the logo sits on — keep the header/footer plate matched to
          // the artwork backdrop so no rectangular seam shows.
          logobg: "#FDFBF8",
          logobgEdge: "#F2E9E0",
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
          yellow: "#C0A062",
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
        base: ["1.0625rem", { lineHeight: "1.7rem" }], // 17px
      },
      fontFamily: {
        // Body — modern, quiet, highly legible.
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        // Headings — the classic half. A high-contrast serif does the
        // "boutique" work that no weight of a geometric sans can.
        display: ["var(--font-playfair)", "Georgia", "serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        // The logo wordmark keeps the rounded face from the business card.
        logo: ["var(--font-logo)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.28em",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #FF9DBE 0%, #EE4C89 55%, #C7326E 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, #FFE7F0 0%, #FFD8E6 60%, #F7E3D2 100%)",
        // deep plum gradient — for dark hero/section surfaces
        "brand-navy-gradient":
          "linear-gradient(135deg, #4B1733 0%, #2A101E 60%, #1A0C14 100%)",
        // soft pearl sweep — used for shimmering text on dark plum
        "brand-chrome":
          "linear-gradient(135deg, #FFFFFF 0%, #FFD8E6 45%, #E7C7D6 100%)",
        // champagne sweep — the classic accent, for rules and ornaments
        "brand-gold": "linear-gradient(90deg, #E4D6B8 0%, #C0A062 50%, #E4D6B8 100%)",
        // paper grain — a barely-there warmth over flat fills
        "brand-paper":
          "radial-gradient(circle at 20% 0%, rgba(238,76,137,0.05) 0%, transparent 45%), radial-gradient(circle at 90% 10%, rgba(192,160,98,0.08) 0%, transparent 40%)",
      },
      boxShadow: {
        brand: "0 14px 40px -18px rgba(238, 76, 137, 0.55)",
        navy: "0 14px 40px -18px rgba(37, 19, 31, 0.45)",
        // The everyday card shadow — barely there, warm rather than grey.
        card: "0 1px 2px rgba(37,19,31,0.04), 0 12px 32px -20px rgba(37,19,31,0.28)",
        // Hover lift for cards and tiles.
        lift: "0 2px 4px rgba(37,19,31,0.05), 0 24px 48px -24px rgba(37,19,31,0.35)",
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
        rise: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 4s ease-in-out infinite",
        rise: "rise .6s cubic-bezier(.22,.61,.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
