import SlideManager from "@/components/admin/SlideManager";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getAllSlides, type AdminSlide } from "@/lib/slides";

export const dynamic = "force-dynamic";

export default async function AdminSlidesPage() {
  let slides: AdminSlide[] = [];
  let loadError: string | null = null;

  try {
    slides = await getAllSlides();
  } catch (error) {
    console.error("Failed to load slides:", error);
    loadError =
      "Could not load the banners. Run `npm run db:push` to create the slider table, then reload.";
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Storefront"
        title="Homepage slider"
        subtitle="Add the banners shown at the top of the homepage. Wide pictures (about 1920×900) look best — the store never stretches a picture past its own size, so a small one stays sharp instead of going blurry."
      />

      {loadError ? (
        <p className="border border-brand-logoRed/25 bg-brand-logoRed/[0.04] p-5 text-sm text-brand-ink">
          {loadError}
        </p>
      ) : (
        <SlideManager initialSlides={slides} />
      )}
    </div>
  );
}
