import { NextResponse } from "next/server";
import { open, stat } from "fs/promises";
import path from "path";
import {
  CONTENT_TYPE_BY_EXT,
  canUseLocalDisk,
  resolveUploadPath,
} from "@/lib/local-uploads";

// Serves media written by the dev-only local-disk upload fallback. Production
// uploads go to Vercel Blob and are served from its own CDN domain instead.

const CACHE_CONTROL = "public, max-age=31536000, immutable";

/**
 * Parse a single-range `Range: bytes=a-b` header against a known file size.
 * Returns null for absent/unsupported ranges (caller then sends the whole
 * file) and "invalid" when the range falls outside the file (416).
 */
function parseRange(
  header: string | null,
  size: number
): { start: number; end: number } | "invalid" | null {
  if (!header) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;

  const [, rawStart, rawEnd] = match;
  if (!rawStart && !rawEnd) return null;

  let start: number;
  let end: number;
  if (!rawStart) {
    // Suffix range: last N bytes.
    const suffix = Number(rawEnd);
    if (suffix <= 0) return "invalid";
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(rawStart);
    end = rawEnd ? Number(rawEnd) : size - 1;
  }

  if (start > end || start >= size) return "invalid";
  return { start, end: Math.min(end, size - 1) };
}

/**
 * Read `length` bytes starting at `start`. Returns a plain ArrayBuffer, which
 * Response accepts directly as a body.
 */
async function readSlice(
  filePath: string,
  start: number,
  length: number
): Promise<ArrayBuffer> {
  const handle = await open(filePath, "r");
  try {
    const view = new Uint8Array(new ArrayBuffer(length));
    await handle.read(view, 0, length, start);
    return view.buffer;
  } finally {
    await handle.close();
  }
}

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  if (!canUseLocalDisk) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = resolveUploadPath(params.path ?? []);
  if (!filePath) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPE_BY_EXT[ext];
  if (!contentType) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) {
      return new NextResponse("Not found", { status: 404 });
    }

    const range = parseRange(request.headers.get("range"), info.size);
    if (range === "invalid") {
      return new NextResponse("Range not satisfiable", {
        status: 416,
        headers: { "Content-Range": `bytes */${info.size}` },
      });
    }

    // Range requests let <video> seek without re-downloading the whole file.
    if (range) {
      const length = range.end - range.start + 1;
      const body = await readSlice(filePath, range.start, length);
      return new NextResponse(body, {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(length),
          "Content-Range": `bytes ${range.start}-${range.end}/${info.size}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": CACHE_CONTROL,
        },
      });
    }

    const body = await readSlice(filePath, 0, info.size);
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(info.size),
        "Accept-Ranges": "bytes",
        // Filenames carry a random suffix, so contents never change in place.
        "Cache-Control": CACHE_CONTROL,
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
