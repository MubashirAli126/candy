"use client";

import MediaUploader from "./MediaUploader";
import { MAX_COLORS } from "@/lib/colors";

/**
 * The other colours one design comes in — one picture each.
 *
 * Colours are never named here. A typed name only guesses at the shade and
 * leaves the buyer wondering what they are getting, while the photo shows it
 * exactly, so the picture is the whole colour.
 *
 * The explanation sits outside the uploader because MediaUploader's own footnote
 * appears only once a picture has been added, which is too late to explain what
 * the section is for.
 */
export default function ColorPicturesField({
  images,
  onChange,
  onUploadingChange,
  onError,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  /** Bubbled up so the form can block submit while a picture is uploading. */
  onUploadingChange?: (uploading: boolean) => void;
  onError?: (message: string | null) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-xs leading-relaxed text-brand-inkSoft">
        Same suit in another colour? Add one picture per colour here instead of
        uploading the design again — buyers pick a colour by its picture, so
        nothing needs naming. Up to {MAX_COLORS} colours. Leave it empty if the
        design comes in one colour only.
      </p>
      <MediaUploader
        images={images}
        onImagesChange={onChange}
        onUploadingChange={onUploadingChange}
        onError={onError}
        max={MAX_COLORS}
        label="Other colours of this design"
        hint="One picture per colour — use ← → to set the order buyers see them in."
        allowUrl
      />
    </div>
  );
}
