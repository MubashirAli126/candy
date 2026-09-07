import SlideManager from "@/components/admin/SlideManager";
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
      <h1 className="font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">
        Homepage slider
      </h1>
      <p className="mb-6 mt-1 text-sm text-gray-500">
        Add the banners shown at the top of the homepage. Wide pictures
        (about 1920×900) look best — the store never stretches a picture past
        its own size, so a small one stays sharp instead of going blurry.
      </p>

      {loadError ? (
        <p className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {loadError}
        </p>
      ) : (
        <SlideManager initialSlides={slides} />
      )}
    </div>
  );
}
