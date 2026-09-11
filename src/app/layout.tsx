import type { Metadata, Viewport } from "next";
import { Poppins, Fredoka, Playfair_Display } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema, SITE_NAME } from "@/lib/seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// The classic half of the type system — a high-contrast serif for every
// heading. Its italic ships too, so accents are a real italic rather than a
// synthesised slant.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

// The logo wordmark. The printed artwork is a wide, very heavy rounded face,
// and of the rounded faces on Google Fonts this one carries that weight
// closest — Baloo 2, which this replaced, thins out at the 24px header size.
// M PLUS Rounded 1c is a shade closer still, but next/font has no metric
// overrides for it, so it gets no size-adjusted fallback: the wordmark would
// reflow and the confetti dots, which are placed against this face's ink
// lines, would land wrong for as long as the webfont took to arrive.
const rounded = Fredoka({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-logo",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Ladies 3 Piece, 2 Piece & Kurti Online in Pakistan`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Shop ladies stitched suits online in Pakistan — 3 piece suits, 2 piece suits and kurtis. Fresh seasonal designs, premium fabric, fast cash-on-delivery.",
  keywords: [
    "ladies suits Pakistan",
    "3 piece suit",
    "2 piece suit",
    "kurti online",
    "ladies stitched suits",
    "women clothing Pakistan",
    "lawn suits",
    "Candy",
    "Candy Clothing",
    "ladies dresses online Pakistan",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Ladies 3 Piece, 2 Piece & Kurti Online in Pakistan`,
    description:
      "Ladies 3 piece & 2 piece suits and kurtis. Fresh seasonal designs, premium fabric, fast cash-on-delivery across Pakistan.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Ladies Clothing Online in Pakistan`,
    description:
      "Ladies 3 piece, 2 piece suits & kurtis. Fresh designs, fast delivery.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Capped, not locked — pinch-zoom stays available for accessibility.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} ${rounded.variable}`}>
      <body className="overflow-x-hidden bg-brand-ivory font-sans text-brand-ink">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {children}
      </body>
    </html>
  );
}
