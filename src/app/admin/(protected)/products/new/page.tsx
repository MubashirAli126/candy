import QuickProductForm from "@/components/admin/QuickProductForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminBackLink from "@/components/admin/AdminBackLink";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div>
      <AdminPageHeader
        back={
          <AdminBackLink href="/admin/products">Back to products</AdminBackLink>
        }
        eyebrow="Catalogue"
        title="Add product"
      />
      <QuickProductForm />
    </div>
  );
}
