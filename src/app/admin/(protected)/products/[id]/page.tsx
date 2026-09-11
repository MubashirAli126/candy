import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminBackLink from "@/components/admin/AdminBackLink";
import { toProductType } from "@/lib/types";
import { productGallery } from "@/lib/utils";
import { parseSizeOptions } from "@/lib/sizes";
import { parseColorImages } from "@/lib/colors";

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
      <AdminPageHeader
        back={
          <AdminBackLink href="/admin/products">Back to products</AdminBackLink>
        }
        eyebrow="Catalogue"
        title="Edit product"
        subtitle={product.name}
      />
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
          colors: parseColorImages(product.colors),
          stock: product.stock,
          categoryId: product.categoryId,
          featured: product.featured,
          active: product.active,
          tags: product.tags ?? "",
          productType: toProductType(product.productType),
          customType: product.customType ?? "",
        }}
      />
    </div>
  );
}
