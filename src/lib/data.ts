import { prisma } from "./prisma";
import type { ProductCardData } from "@/components/ProductCard";
import type { ProductType } from "./types";
import { parseImages } from "./utils";

/** Map a Prisma product (with category) to the card shape used in listings. */
function toCardData(p: {
  id: string;
  slug: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  images?: string | null;
  stock: number;
  size?: string | null;
  productType?: string | null;
  customType?: string | null;
  category?: { name: string; slug?: string } | null;
}): ProductCardData {
  // The card flips to the second gallery picture on hover; skip anything that
  // repeats the main shot so the swap is always visible.
  const hoverImage = parseImages(p.images).find((url) => url && url !== p.image);

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    salePrice: p.salePrice,
    image: p.image,
    hoverImage,
    stock: p.stock,
    size: p.size,
    productType: p.productType,
    customType: p.customType,
    categoryName: p.category?.name,
    categorySlug: p.category?.slug,
  };
}

export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toCardData);
}

/**
 * Newest active products, whether or not they are featured — the homepage grid
 * stays full even before anyone ticks the "featured" box.
 */
export async function getLatestProducts(limit = 12) {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toCardData);
}

export async function getAllProducts(
  categorySlug?: string,
  productType?: ProductType,
  search?: string
) {
  // Free-text search covers the fields a shopper would actually type: the
  // product name, its tags and the custom type label.
  const term = search?.trim();
  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(productType ? { productType } : {}),
      ...(term
        ? {
            OR: [
              { name: { contains: term, mode: "insensitive" as const } },
              { tags: { contains: term, mode: "insensitive" as const } },
              { customType: { contains: term, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(toCardData);
}

/** How many active products exist per product type — powers the filter chips. */
export async function getProductTypeCounts(): Promise<Record<string, number>> {
  const grouped = await prisma.product.groupBy({
    by: ["productType"],
    where: { active: true },
    _count: { _all: true },
  });
  return Object.fromEntries(
    grouped.map((g) => [g.productType, g._count._all])
  );
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4
) {
  const products = await prisma.product.findMany({
    where: { active: true, categoryId, id: { not: excludeId } },
    include: { category: true },
    take: limit,
  });
  return products.map(toCardData);
}

/**
 * Look up one order for the public tracking page. Both the order number and
 * the phone it was placed with are required, so an order number alone never
 * exposes a customer's address.
 */
export async function getOrderForTracking(orderNumber: string, phone: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: orderNumber.trim().toUpperCase() },
    include: { items: true },
  });
  if (!order) return null;

  // Compare digits only — buyers type 0300-1234567, 03001234567 or +92300…
  const digits = (value: string) => value.replace(/\D/g, "");
  const given = digits(phone);
  const stored = digits(order.phone);
  const matches =
    given.length >= 7 && (stored.endsWith(given) || given.endsWith(stored));

  return matches ? order : null;
}
