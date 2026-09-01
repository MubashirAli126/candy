import type { Metadata, Viewport } from "next";
import { Poppins, Baloo_2 } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema, SITE_NAME } from "@/lib/seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-baloo",
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
    <html lang="en" className={`${poppins.variable} ${baloo.variable}`}>
      <body className="overflow-x-hidden font-sans">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {children}
      </body>
    </html>
  );
}
