import { stickerTypeIcon, stickerTypeLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface StickerTypeBadgeProps {
  stickerType: string | null | undefined;
  customType?: string | null;
  className?: string;
  /** "sm" for product cards and tables, "md" for the product detail page. */
  size?: "sm" | "md";
}

/**
 * Small pill showing what kind of sticker a product is (car / bike / wall, or
 * the admin's own label when the type is "Other").
 */
export default function StickerTypeBadge({
  stickerType,
  customType,
  className,
  size = "sm",
}: StickerTypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-brand-purple/10 font-semibold text-brand-purple",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-sm",
        className
      )}
    >
      <span aria-hidden="true">{stickerTypeIcon(stickerType)}</span>
      {stickerTypeLabel(stickerType, customType)}
    </span>
  );
}
