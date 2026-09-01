/**
 * Central SEO helpers: site-wide constants and JSON-LD structured-data builders.
 * Keeping schema generation here avoids duplicating Schema.org boilerplate across
 * pages and keeps Google Rich Results output consistent.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "Candy";

/** Short form for tight spots (badges, mobile titles, WhatsApp messages). */
export const SITE_NAME_SHORT = "Candy";

/**
 * Contact people from the business card. The first entry is the default
 * WhatsApp / phone destination used across the site.
 */
export const CONTACTS = [
  { name: "M Jameel", display: "0300-9297355", intl: "923009297355" },
  { name: "M Zohaib", display: "0312-2970685", intl: "923122970685" },
] as const;

/** Facebook / Instagram / TikTok handle, exactly as printed on the card. */
export const SOCIAL_HANDLE = "candypk.offcial";

export const SOCIALS = {
  facebook: `https://www.facebook.com/${SOCIAL_HANDLE}`,
  instagram: `https://www.instagram.com/${SOCIAL_HANDLE}`,
  tiktok: `https://www.tiktok.com/@${SOCIAL_HANDLE}`,
} as const;

export const STORE = {
  name: SITE_NAME,
  legalName: "Candy Clothing",
  /** Printed under the wordmark on the card. */
  tagline: "Wholesale Ladies Garments Manufacturer",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? CONTACTS[0].intl,
  contacts: CONTACTS,
  socials: SOCIALS,
  street: "B-69, Ground Floor, Karim Center, Saddar",
  city: "Karachi",
  country: "PK",
  /** Full one-line address for footers and contact cards. */
  address: "B-69, Ground Floor, Karim Center, Saddar, Karachi",
  logo: `${SITE_URL}/logo.png`,
} as const;

/** Absolute URL from a site-relative path (or pass-through for already-absolute URLs). */
function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Organization + Store schema for the site root. */
export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/#organization`,
    name: STORE.name,
    legalName: STORE.legalName,
    description:
      "Ladies clothing store in Pakistan — 3 piece suits, 2 piece suits and kurtis. Fresh designs with fast cash-on-delivery.",
    url: SITE_URL,
    logo: STORE.logo,
    image: STORE.logo,
    telephone: `+${STORE.whatsapp}`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: STORE.street,
      addressCountry: STORE.country,
      addressLocality: STORE.city,
    },
    areaServed: { "@type": "Country", name: "Pakistan" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: CONTACTS.map((c) => `+${c.intl}`),
      availableLanguage: ["en", "ur"],
    },
    sameAs: Object.values(SOCIALS) as string[],
  };
}

/** WebSite schema — helps Google understand the site name for branded results. */
export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-PK",
  };
}

/** BreadcrumbList schema from an ordered list of {name, path} crumbs. */
export function breadcrumbSchema(
  crumbs: Array<{ name: string; path: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** Product schema with an Offer, enriched to satisfy Google Merchant listings. */
export function productSchema(product: {
  name: string;
  slug: string;
  description: string;
  image: string;
  images?: string[];
  price: number;
  salePrice?: number | null;
  stock: number;
  categoryName?: string;
  sku?: string;
}): Record<string, unknown> {
  const effectivePrice = product.salePrice ?? product.price;
  const url = `${SITE_URL}/products/${product.slug}`;
  const allImages = [product.image, ...(product.images ?? [])]
    .filter(Boolean)
    .map(absoluteUrl);

  // priceValidUntil is a recommended field; set it a year out from the current
  // build so the offer never appears expired in Search Console.
  const priceValidUntil = new Date();
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: allImages.length ? allImages : [absoluteUrl(product.image)],
    sku: product.sku,
    ...(product.categoryName ? { category: product.categoryName } : {}),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "PKR",
      price: effectivePrice,
      priceValidUntil: priceValidUntil.toISOString().slice(0, 10),
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@id": `${SITE_URL}/#organization` },
    },
  };
}

/** ItemList schema for a collection/category listing page. */
export function itemListSchema(
  products: Array<{ slug: string; name: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/products/${p.slug}`,
    })),
  };
}
