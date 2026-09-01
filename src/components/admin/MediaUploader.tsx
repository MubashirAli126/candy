"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_IMAGES, acceptAttr } from "@/lib/media";

interface UploadResponse {
  url?: string;
  error?: string;
}

/** Upload one file to the admin media endpoint and return its public URL. */
async function uploadFile(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data: UploadResponse = await res.json();
  if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
  return data.url;
}

export interface MediaUploaderProps {
  /** Ordered gallery — the first entry is the main product image. */
  images: string[];
  onImagesChange: (images: string[]) => void;
  /** Reported whenever an upload starts/finishes so forms can disable submit. */
  onUploadingChange?: (uploading: boolean) => void;
  onError?: (message: string | null) => void;
  maxImages?: number;
  /** Show a field for adding an image that is already hosted elsewhere. */
  allowUrl?: boolean;
}

/**
 * Multi-image picker shared by the quick add form and the full product form.
 * Order matters: images[0] is the product's main image.
 */
export default function MediaUploader({
  images,
  onImagesChange,
  onUploadingChange,
  onError,
  maxImages = MAX_IMAGES,
  allowUrl = false,
}: MediaUploaderProps) {
  const [imagesBusy, setImagesBusy] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const imageInput = useRef<HTMLInputElement>(null);

  const remaining = Math.max(0, maxImages - images.length);

  // Report the upload state so the parent can disable submit while an upload
  // is still in flight.
  useEffect(() => {
    onUploadingChange?.(imagesBusy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesBusy]);

  function fail(err: unknown) {
    onError?.(err instanceof Error ? err.message : "Upload failed");
  }

  async function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    // Reset immediately so re-picking the same file still fires onChange.
    e.target.value = "";
    if (picked.length === 0) return;

    onError?.(null);
    if (picked.length > remaining) {
      onError?.(
        `You can add ${maxImages} images at most — only the first ${remaining} were uploaded.`
      );
    }

    const batch = picked.slice(0, remaining);
    if (batch.length === 0) return;

    setImagesBusy(true);
    try {
      // Sequential: keeps upload order stable and avoids hammering the route.
      const uploaded: string[] = [];
      for (const file of batch) {
        uploaded.push(await uploadFile(file));
      }
      onImagesChange([...images, ...uploaded]);
    } catch (err) {
      fail(err);
    } finally {
      setImagesBusy(false);
    }
  }

  function removeImage(index: number) {
    onImagesChange(images.filter((_, i) => i !== index));
  }

  function addUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    if (remaining === 0) {
      onError?.(`You can add ${maxImages} images at most.`);
      return;
    }
    if (images.includes(url)) {
      onError?.("That image is already in the gallery.");
      return;
    }
    onError?.(null);
    onImagesChange([...images, url]);
    setUrlDraft("");
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onImagesChange(next);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-dark">
        Pictures {images.length > 0 && `(${images.length}/${maxImages})`}
      </label>
      <input
        ref={imageInput}
        type="file"
        accept={acceptAttr("image")}
        multiple
        onChange={handleImages}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => imageInput.current?.click()}
        disabled={imagesBusy || remaining === 0}
        className="w-full rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm font-semibold text-brand-dark transition-colors hover:border-brand-purple disabled:opacity-60"
      >
        {imagesBusy
          ? "Uploading..."
          : remaining === 0
          ? `Maximum ${maxImages} pictures added`
          : images.length > 0
          ? "➕ Add more pictures"
          : "📷 Choose pictures (you can select several)"}
      </button>

      {images.length > 0 && (
        <>
          <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((url, index) => (
              <li
                key={`${url}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-xl border border-black/5 bg-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={index === 0 ? "Main picture" : `Picture ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {index === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-bold text-brand-dark shadow">
                    MAIN
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label={`Remove picture ${index + 1}`}
                  className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-xs font-bold text-white transition-opacity hover:bg-black/80 sm:h-6 sm:w-6"
                >
                  ✕
                </button>
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 transition-opacity focus-within:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move picture ${index + 1} left`}
                    className="px-3 py-1.5 text-xs font-bold text-white disabled:opacity-30 sm:px-2 sm:py-1"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    aria-label={`Move picture ${index + 1} right`}
                    className="px-3 py-1.5 text-xs font-bold text-white disabled:opacity-30 sm:px-2 sm:py-1"
                  >
                    →
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-gray-400">
            The first picture is used as the main image — use ← → to reorder.
          </p>
        </>
      )}

      {allowUrl && (
        <div className="mt-3 flex gap-2">
          <input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // Don't let Enter submit the surrounding product form.
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="…or paste an image URL"
            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-purple"
          />
          <button
            type="button"
            onClick={addUrl}
            disabled={!urlDraft.trim() || remaining === 0}
            className="shrink-0 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-dark transition-colors hover:border-brand-purple disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
