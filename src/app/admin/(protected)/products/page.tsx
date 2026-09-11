import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn, formatPrice } from "@/lib/utils";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductTypeBadge from "@/components/ProductTypeBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

/** Active / hidden pill — the same chip in both the card and the table. */
function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em]",
        active
          ? "bg-brand-ink text-brand-goldSoft"
          : "bg-brand-sand text-brand-inkMuted"
      )}
    >
      {active ? "Active" : "Hidden"}
    </span>
  );
}

function FeaturedFlag() {
  return (
    <span className="ml-2 inline-block border border-brand-gold/60 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-brand-gold">
      ★ Featured
    </span>
  );
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Products"
        subtitle={`${products.length} ${products.length === 1 ? "product" : "products"} in the store.`}
        actions={
          <Link href="/admin/products/new" className="btn btn-candy btn-sm">
            + Add product
          </Link>
        }
      />

      {products.length === 0 ? (
        <p className="border border-brand-ink/10 bg-white p-10 text-center text-sm text-brand-inkSoft">
          No products yet. Click “Add product” to create your first one.
        </p>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {products.map((p) => (
              <div key={p.id} className="card p-4">
                <div className="flex items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-16 w-16 shrink-0 rounded-sm border border-brand-ink/10 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-brand-ink">
                        {p.name}
                        {p.featured && <FeaturedFlag />}
                      </span>
                      <StatusPill active={p.active} />
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-brand-inkMuted">
                        {p.category.name}
                      </span>
                      <ProductTypeBadge
                        productType={p.productType}
                        customType={p.customType}
                      />
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 text-sm">
                      <span className="font-semibold text-brand-ink">
                        {formatPrice(p.salePrice ?? p.price)}
                      </span>
                      <span
                        className={
                          p.stock === 0
                            ? "text-brand-logoRed"
                            : "text-brand-inkSoft"
                        }
                      >
                        Stock: {p.stock}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2 border-t border-brand-ink/10 pt-3">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="link-underline px-2 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-inkSoft hover:text-brand-ink"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton id={p.id} name={p.name} />
                </div>
              </div>
            ))}
          </div>

          <div className="table-shell hidden md:block">
            <table className="w-full text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3.5">Product</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="hidden px-4 py-3.5 sm:table-cell">Category</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="hidden px-4 py-3.5 sm:table-cell">Stock</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="table-row">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-11 w-11 shrink-0 rounded-sm border border-brand-ink/10 object-cover"
                        />
                        <span className="font-semibold text-brand-ink">
                          {p.name}
                          {p.featured && <FeaturedFlag />}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <ProductTypeBadge
                        productType={p.productType}
                        customType={p.customType}
                      />
                    </td>
                    <td className="hidden px-4 py-3.5 text-brand-inkSoft sm:table-cell">
                      {p.category.name}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-brand-ink">
                      {formatPrice(p.salePrice ?? p.price)}
                    </td>
                    <td className="hidden px-4 py-3.5 sm:table-cell">
                      <span
                        className={
                          p.stock === 0
                            ? "text-brand-logoRed"
                            : "text-brand-inkSoft"
                        }
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusPill active={p.active} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="link-underline text-xs font-semibold uppercase tracking-[0.14em] text-brand-inkSoft hover:text-brand-ink"
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
