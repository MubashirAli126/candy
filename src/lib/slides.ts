import { prisma } from "./prisma";
import type { HeroSlide } from "@/components/HeroCarousel";

/**
 * Banners shown until an admin adds their own in /admin/slides. Kept here (not
 * in the page) so both the storefront and the admin panel describe the
 * fallback the same way.
 *
 * The pictures are licensed stock of Pakistani pret — an embroidered 3 piece,
 * a printed 2 piece, a lawn kurti and a chiffon formal — so each banner shows
 * the garment its link actually filters to. They are still placeholders: swap
 * them for the shop's own shoot in /admin/slides, because these outfits are
 * not Candy's stock and a buyer who taps one should land on the same dress.
 *
 * Portrait artwork, which the carousel crops from the bottom — see
 * HeroCarousel. Requested at 2000px wide so the desktop banner stays sharp.
 */
export const FALLBACK_SLIDES: HeroSlide[] = [
  {
    eyebrow: "New Season",
    title: "Festive Edit — stitched 3 piece suits",
    subtitle:
      "Embroidered shirts, matching trousers and dupattas in premium lawn and chiffon.",
    href: "/products?type=THREE_PIECE",
    cta: "Shop now",
    image:
      "https://images.unsplash.com/photo-1733470381571-c3d082e68457?w=2000&q=85",
  },
  {
    eyebrow: "Everyday Luxury",
    title: "2 Piece sets for every day",
    subtitle: "Easy shirt-and-trouser pairs that carry you from work to dinner.",
    href: "/products?type=TWO_PIECE",
    cta: "Shop now",
    image:
      "https://images.unsplash.com/photo-1741847639057-b51a25d42892?w=2000&q=85",
  },
  {
    eyebrow: "Ready to Wear",
    title: "Kurtis, freshly stitched",
    subtitle:
      "Casual, formal and embroidered kurtis — dispatched within 24 hours.",
    href: "/products?type=KURTI",
    cta: "Shop now",
    image:
      "https://images.unsplash.com/photo-1745313452052-0e4e341f326c?w=2000&q=85",
  },
  {
    eyebrow: "Occasion Wear",
    title: "Chiffon formals for the wedding season",
    subtitle:
      "Hand-embroidered shirts with net dupattas — stitched to your size on request.",
    href: "/products",
    cta: "View collection",
    image:
      "https://images.unsplash.com/photo-1705920824583-0e783235394d?w=2000&q=85",
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
