import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductTypeBadge from "@/components/ProductTypeBadge";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-gray-500">{products.length} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand-gradient px-5 py-2.5 font-bold text-brand-dark shadow-brand"
        >
          + Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-white p-10 text-center text-gray-500 shadow-card">
          No products yet. Click “Add product” to create your first one.
        </p>
      ) : (
        <>
          <div className="mt-6 space-y-3 md:hidden">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-black/5 bg-white p-4 shadow-card"
              >
                <div className="flex items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-brand-dark">
                        {p.name}
                        {p.featured && (
                          <span className="ml-2 rounded bg-brand-yellow/20 px-1.5 py-0.5 text-xs font-bold text-brand-dark">
                            ★ Featured
                          </span>
                        )}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                          p.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.active ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {p.category.name}
                      </span>
                      <ProductTypeBadge
                        productType={p.productType}
                        customType={p.customType}
                      />
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-sm">
                      <span className="font-semibold">
                        {formatPrice(p.salePrice ?? p.price)}
                      </span>
                      <span
                        className={p.stock === 0 ? "text-red-500" : "text-gray-500"}
                      >
                        Stock: {p.stock}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2 border-t border-black/5 pt-3">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-purple hover:bg-brand-purple/5"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton id={p.id} name={p.name} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-card md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-black/5 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        />
                        <span className="font-semibold text-brand-dark">
                          {p.name}
                          {p.featured && (
                            <span className="ml-2 rounded bg-brand-yellow/20 px-1.5 py-0.5 text-xs font-bold text-brand-dark">
                              ★ Featured
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ProductTypeBadge
                        productType={p.productType}
                        customType={p.customType}
                      />
                    </td>
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                      {p.category.name}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatPrice(p.salePrice ?? p.price)}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span
                        className={p.stock === 0 ? "text-red-500" : "text-gray-500"}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          p.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-purple hover:bg-brand-purple/5"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
