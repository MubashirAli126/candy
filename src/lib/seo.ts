/**
 * Central SEO helpers: site-wide constants and JSON-LD structured-data builders.
 * Keeping schema generation here avoids duplicating Schema.org boilerplate across
 * pages and keeps Google Rich Results output consistent.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "Asad Sticker & Auto Zone";

/** Short form for tight spots (badges, mobile titles, WhatsApp messages). */
export const SITE_NAME_SHORT = "Asad Sticker Zone";

export const STORE = {
  name: SITE_NAME,
  legalName: "Asad Sticker & Auto Zone",
  email: "hello@asadstickerautozone.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "923001234567",
  city: "Karachi",
  country: "PK",
  logo: `${SITE_URL}/logo.png`,
} as const;

/** Absolute URL from a site-relative path (or pass-through for already-absolute URLs). */
export function absoluteUrl(path: string): string {
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
      "Premium car, bike and wall stickers online store in Pakistan. Custom vinyl designs with fast cash-on-delivery.",
    url: SITE_URL,
    logo: STORE.logo,
    image: STORE.logo,
    email: STORE.email,
    telephone: `+${STORE.whatsapp}`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: STORE.country,
      addressLocality: STORE.city,
    },
    areaServed: { "@type": "Country", name: "Pakistan" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${STORE.whatsapp}`,
      email: STORE.email,
      availableLanguage: ["en", "ur"],
    },
    sameAs: [] as string[],
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
