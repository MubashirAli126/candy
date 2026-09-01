import type { Metadata } from "next";
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
    default: `${SITE_NAME} — Car, Bike & Wall Stickers Online in Pakistan`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Buy premium car stickers, bike decals & wall stickers online in Pakistan. Custom vinyl designs, weather-proof quality, fast cash-on-delivery. Chamka do apni dunya!",
  keywords: [
    "car stickers Pakistan",
    "bike stickers",
    "wall stickers",
    "vinyl decals",
    "custom stickers",
    "motorcycle stickers",
    "wall decals",
    "Asad Sticker & Auto Zone",
    "Asad Sticker Zone",
    "Asad Sticker Gul Plaza Karachi",
    "stickers online Pakistan",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Car, Bike & Wall Stickers Online in Pakistan`,
    description:
      "Premium car, bike & wall stickers. Custom vinyl designs, weather-proof quality, fast cash-on-delivery across Pakistan.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Stickers Online in Pakistan`,
    description:
      "Premium car, bike & wall stickers. Custom designs, fast delivery.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${baloo.variable}`}>
      <body className="font-sans">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {children}
      </body>
    </html>
  );
}
