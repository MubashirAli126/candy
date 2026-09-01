import { prisma } from "./prisma";
import type { ProductCardData } from "@/components/ProductCard";
import type { ProductType } from "./types";

/** Map a Prisma product (with category) to the card shape used in listings. */
function toCardData(p: {
  id: string;
  slug: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  stock: number;
  size?: string | null;
  productType?: string | null;
  customType?: string | null;
  category?: { name: string; slug?: string } | null;
}): ProductCardData {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    salePrice: p.salePrice,
    image: p.image,
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

export async function getAllProducts(
  categorySlug?: string,
  productType?: ProductType
) {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(productType ? { productType } : {}),
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
