/**
 * Shared product-media rules. Kept framework-free so the upload route, the
 * admin uploader UI and the product API validators all agree on one set of
 * limits.
 */

export type MediaKind = "image" | "video";

/** Pictures per product, main image included. */
export const MAX_IMAGES = 8;

export const MEDIA_RULES: Record<
  MediaKind,
  { maxBytes: number; types: string[]; label: string }
> = {
  image: {
    maxBytes: 5 * 1024 * 1024, // 5 MB
    types: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
    label: "image files (jpg, png, webp, gif, avif)",
  },
  video: {
    maxBytes: 25 * 1024 * 1024, // 25 MB
    types: ["video/mp4", "video/webm", "video/quicktime"],
    label: "video files (mp4, webm, mov)",
  },
};

/** Value for an <input type="file"> accept attribute. */
export function acceptAttr(kind: MediaKind): string {
  return MEDIA_RULES[kind].types.join(",");
}

/** Which media bucket a MIME type belongs to, or null when unsupported. */
export function mediaKindOf(mimeType: string): MediaKind | null {
  if (MEDIA_RULES.image.types.includes(mimeType)) return "image";
  if (MEDIA_RULES.video.types.includes(mimeType)) return "video";
  return null;
}

export function megabytes(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}
