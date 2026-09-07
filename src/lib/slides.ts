import { prisma } from "./prisma";
import type { HeroSlide } from "@/components/HeroCarousel";

/**
 * Banners shown until an admin adds their own in /admin/slides. Kept here (not
 * in the page) so both the storefront and the admin panel describe the
 * fallback the same way.
 */
export const FALLBACK_SLIDES: HeroSlide[] = [
  {
    eyebrow: "New Season",
    title: "Festive Edit — stitched 3 piece suits",
    subtitle:
      "Embroidered shirts, matching trousers and dupattas in premium lawn and linen.",
    href: "/products?type=THREE_PIECE",
    cta: "Shop now",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=2000&q=85",
  },
  {
    eyebrow: "Everyday Luxury",
    title: "2 Piece sets for every day",
    subtitle: "Easy shirt-and-trouser pairs that carry you from work to dinner.",
    href: "/products?type=TWO_PIECE",
    cta: "Shop now",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=2000&q=85",
  },
  {
    eyebrow: "Ready to Wear",
    title: "Kurtis, freshly stitched",
    subtitle:
      "Casual, formal and embroidered kurtis — dispatched within 24 hours.",
    href: "/products?type=KURTI",
    cta: "Shop now",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=2000&q=85",
  },
];

export const DEFAULT_CTA = "Shop now";

export interface AdminSlide {
  id: string;
  image: string;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  href: string | null;
  cta: string | null;
  sortOrder: number;
  active: boolean;
}

/** Every slide, active or not — the admin list needs both. */
export async function getAllSlides(): Promise<AdminSlide[]> {
  return prisma.heroSlide.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      image: true,
      eyebrow: true,
      title: true,
      subtitle: true,
      href: true,
      cta: true,
      sortOrder: true,
      active: true,
    },
  });
}

/**
 * Active banners for the homepage carousel. Falls back to FALLBACK_SLIDES when
 * the admin hasn't added any (or the table isn't migrated yet) so the top of
 * the homepage is never an empty frame.
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  let rows: AdminSlide[] = [];
  try {
    rows = await prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        image: true,
        eyebrow: true,
        title: true,
        subtitle: true,
        href: true,
        cta: true,
        sortOrder: true,
        active: true,
      },
    });
  } catch (error) {
    console.error("Failed to load hero slides:", error);
    return FALLBACK_SLIDES;
  }

  if (rows.length === 0) return FALLBACK_SLIDES;

  return rows.map((row) => ({
    image: row.image,
    eyebrow: row.eyebrow?.trim() || undefined,
    title: row.title?.trim() || undefined,
    subtitle: row.subtitle?.trim() || undefined,
    href: row.href?.trim() || undefined,
    cta: row.cta?.trim() || DEFAULT_CTA,
  }));
}
