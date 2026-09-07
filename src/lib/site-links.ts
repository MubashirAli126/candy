/**
 * Storefront navigation and footer link groups.
 *
 * The header nav, the mobile drawer and the footer columns all read from here,
 * so a page that is added or renamed only has to change in one place — and the
 * two menus can never drift apart.
 */

export interface SiteLink {
  href: string;
  label: string;
  /** Opens in a new tab (external destinations only). */
  external?: boolean;
}

/** Rotating messages in the thin bar above the header. */
export const ANNOUNCEMENTS = [
  "Free delivery on orders over Rs. 5,000 — all across Pakistan 🚚",
  "Cash on delivery available nationwide 💵",
  "Fresh seasonal designs added every week ✨",
  "Dispatched within 24 hours · Delivery in 3–5 working days",
] as const;

/** Primary header navigation. */
export const MAIN_NAV: SiteLink[] = [
  { href: "/products", label: "Pret — Ready to Wear" },
];

/** Small utility links shown above the logo row on desktop. */
export const UTILITY_NAV: SiteLink[] = [
  { href: "/track-order", label: "Track Your Order" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export const FOOTER_ACCOUNT: SiteLink[] = [
  { href: "/cart", label: "View Cart" },
  { href: "/checkout", label: "Checkout" },
  { href: "/track-order", label: "Track your Order" },
  { href: "/products", label: "Search products" },
];

export const FOOTER_POLICIES: SiteLink[] = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-conditions", label: "Terms & Conditions" },
  { href: "/exchange-policy", label: "Exchange Policy" },
  { href: "/return-refund-policy", label: "Return & Refund Policy" },
  { href: "/shipping-policy", label: "Shipping Policy" },
];

export const FOOTER_INFORMATION: SiteLink[] = [
  { href: "/about", label: "About Candy" },
  { href: "/size-chart", label: "Size Chart" },
  { href: "/order-processing", label: "Order Processing" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact Us" },
];
