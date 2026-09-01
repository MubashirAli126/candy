import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";
import {
  LOCAL_UPLOAD_ROOT,
  LOCAL_UPLOAD_URL_PREFIX,
  canUseLocalDisk,
} from "@/lib/local-uploads";
import { slugify } from "@/lib/utils";
import { MEDIA_RULES, mediaKindOf, megabytes } from "@/lib/media";

const UPLOAD_DIR = path.join(LOCAL_UPLOAD_ROOT, "products");

// Serverless hosts have a read-only filesystem, so deploys must use Vercel
// Blob. Running locally the filesystem is writable, so fall back to on-disk
// storage and let the admin panel work without a Blob token.
const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!useBlob && !canUseLocalDisk) {
    return NextResponse.json(
      { error: "Media storage is not configured (BLOB_READ_WRITE_TOKEN missing)." },
      { status: 500 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const kind = mediaKindOf(file.type);
  if (!kind) {
    return NextResponse.json(
      {
        error: `Only ${MEDIA_RULES.image.label} and ${MEDIA_RULES.video.label} are allowed.`,
      },
      { status: 400 }
    );
  }

  const rule = MEDIA_RULES[kind];
  if (file.size > rule.maxBytes) {
    return NextResponse.json(
      { error: `This ${kind} is too large (max ${megabytes(rule.maxBytes)}).` },
      { status: 400 }
    );
  }

  const ext = path.extname(file.name).toLowerCase() || (kind === "video" ? ".mp4" : ".jpg");
  const base =
    slugify(path.basename(file.name, path.extname(file.name))) || kind;

  try {
    if (useBlob) {
      // addRandomSuffix keeps repeated uploads of the same filename distinct.
      const blob = await put(`products/${base}${ext}`, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      });

      return NextResponse.json({ url: blob.url, kind }, { status: 201 });
    }

    // Local dev: write to disk and serve it back through /api/uploads.
    // The random suffix keeps repeated uploads of the same filename distinct.
    const suffix = randomUUID().slice(0, 8);
    const filename = `${base}-${suffix}${ext}`;
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(
      path.join(UPLOAD_DIR, filename),
      Buffer.from(await file.arrayBuffer())
    );

    return NextResponse.json(
      { url: `${LOCAL_UPLOAD_URL_PREFIX}/products/${filename}`, kind },
      { status: 201 }
    );
  } catch (error) {
    console.error("Media upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
