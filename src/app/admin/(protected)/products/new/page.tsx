import Link from "next/link";
import QuickProductForm from "@/components/admin/QuickProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div>
      <Link
        href="/admin/products"
        className="text-sm font-semibold text-brand-purple hover:underline"
      >
        ← Back to products
      </Link>
      <h1 className="mb-6 mt-3 font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">
        Add product
      </h1>
      <QuickProductForm />
    </div>
  );
}
