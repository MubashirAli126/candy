import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    // Warm ivory paper rather than the old flat grey — the back office sits on
    // the same canvas as the storefront.
    <div className="min-h-screen bg-brand-ivory bg-brand-paper lg:flex">
      <AdminSidebar email={session.email} />
      <div className="flex-1 lg:ml-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
