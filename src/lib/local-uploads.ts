import path from "path";

/**
 * Dev-only image storage.
 *
 * Serverless hosts have a read-only filesystem, so deploys must use Vercel
 * Blob. Running locally the filesystem is writable, so uploads land here and
 * are served back by the /api/uploads route.
 *
 * Files deliberately live outside public/ — `next start` snapshots the public
 * directory at boot, so anything written there at runtime 404s.
 */
export const LOCAL_UPLOAD_ROOT = path.join(process.cwd(), "uploads");

/** Public URL path that maps to LOCAL_UPLOAD_ROOT. */
export const LOCAL_UPLOAD_URL_PREFIX = "/api/uploads";

/** Vercel sets this on every deploy; absent means a writable local filesystem. */
export const canUseLocalDisk = !process.env.VERCEL;

export const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

/**
 * Resolve a URL path segment list to an absolute path inside the upload root,
 * or null when the result would escape it (path traversal, absolute segments).
 */
export function resolveUploadPath(segments: string[]): string | null {
  if (segments.length === 0) return null;
  if (segments.some((s) => !s || s === "." || s === ".." || s.includes("\0"))) {
    return null;
  }

  const resolved = path.resolve(LOCAL_UPLOAD_ROOT, ...segments);
  const root = path.resolve(LOCAL_UPLOAD_ROOT);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    return null;
  }

  return resolved;
}
