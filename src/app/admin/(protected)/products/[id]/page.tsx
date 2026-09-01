import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { toStickerType } from "@/lib/types";
import { productGallery } from "@/lib/utils";
import { parseSizeOptions } from "@/lib/sizes";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-sm font-semibold text-brand-purple hover:underline"
      >
        ← Back to products
      </Link>
      <h1 className="mb-6 mt-3 font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">
        Edit product
      </h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          salePrice: product.salePrice,
          images: productGallery(product.image, product.images),
          video: product.video,
          sizes: parseSizeOptions(product.size),
          stock: product.stock,
          categoryId: product.categoryId,
          featured: product.featured,
          active: product.active,
          tags: product.tags ?? "",
          stickerType: toStickerType(product.stickerType),
          customType: product.customType ?? "",
        }}
      />
    </div>
  );
}
