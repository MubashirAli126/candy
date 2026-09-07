// One design, several colours.
//
// A suit is uploaded once — design, description, sizes and price shared — and
// each other colour it comes in is added as one more picture. A colour is its
// picture and nothing else: no names, no swatches. A typed name would only
// guess at the shade ("Firozi", "Tea Pink") and leave the buyer wondering what
// they are actually getting, while the photo shows it exactly.
//
// The pictures live in the single free-text column `Product.colors` as a JSON
// array, the trick `Product.images` already uses, so adding a colour never
// needs a migration:
//
//   ["/uploads/red.jpg", "/uploads/navy.jpg"]

/** Colours one design may be offered in. */
export const MAX_COLORS = 12;

/**
 * Cap for the stored JSON string — generous enough for MAX_COLORS long picture
 * URLs, so a legitimate payload is never rejected, while still bounding what a
 * request can write.
 */
export const MAX_COLORS_LENGTH = 8000;

function clean(images: readonly unknown[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const image of images) {
    if (typeof image !== "string") continue;
    const url = image.trim();
    // The same picture twice would be the same colour twice.
    if (!url || seen.has(url)) continue;
    seen.add(url);

    out.push(url);
    if (out.length >= MAX_COLORS) break;
  }

  return out;
}

/**
 * The colour pictures an admin added for a product, in the order they appear to
 * buyers. Anything unreadable parses to "no colours" rather than throwing, so
 * one bad row can never take a product page down.
 *
 * Also reads the shape that stored a name with each colour, keeping the picture
 * and dropping the name; colours that were names only are dropped, since a name
 * on its own is not something we can show.
 */
export function parseColorImages(colors: string | null | undefined): string[] {
  if (!colors) return [];

  const trimmed = colors.trim();
  // A name-only list ("Red | Navy Blue") predates colour pictures entirely and
  // has nothing to show, so it reads as no colours.
  if (!trimmed.startsWith("[") && !trimmed.startsWith("{")) return [];

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) return [];
    return clean(
      parsed.map((entry) => {
        if (typeof entry === "string") return entry;
        // The earlier {label, images} shape — keep its first picture.
        if (entry && typeof entry === "object") {
          const images = (entry as { images?: unknown }).images;
          if (Array.isArray(images)) return images[0];
        }
        return undefined;
      }),
    );
  } catch {
    return [];
  }
}

/**
 * Inverse of {@link parseColorImages}: pack the colour pictures into the one
 * string stored in `Product.colors`. Returns null when there is no usable
 * picture, which is how "this design comes in one colour" is stored.
 */
export function serializeColorImages(images: readonly string[]): string | null {
  const cleaned = clean(images);
  return cleaned.length > 0 ? JSON.stringify(cleaned) : null;
}

/**
 * How a colour is named wherever words are needed instead of the picture — a
 * cart line, an order, the WhatsApp message. Numbered by position, because the
 * picture is the real identity.
 */
export function colorLabel(index: number): string {
  return `Colour ${index + 1}`;
}

/** The label for a colour picture, or null when it isn't one of them. */
export function colorLabelFor(
  images: readonly string[],
  image: string | null | undefined,
): string | null {
  if (!image) return null;
  const index = images.indexOf(image.trim());
  return index === -1 ? null : colorLabel(index);
}

/**
 * Pictures to show for the chosen colour: that colour's photo first, then the
 * design's shared gallery, so the buyer sees the colour they picked and can
 * still browse the detail shots. Falls back to the shared gallery alone when no
 * colour is chosen.
 */
export function galleryForColor(
  colorImages: readonly string[],
  selected: string | null | undefined,
  productImages: readonly string[],
): string[] {
  const picked = selected?.trim();
  if (!picked || !colorImages.includes(picked)) return [...productImages];
  return [picked, ...productImages.filter((url) => url !== picked)];
}
