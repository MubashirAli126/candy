import { productTypeIcon, productTypeLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductTypeBadgeProps {
  productType: string | null | undefined;
  customType?: string | null;
  className?: string;
  /** "sm" for product cards and tables, "md" for the product detail page. */
  size?: "sm" | "md";
}

/**
 * Small tag showing what kind of outfit a product is (3 piece / 2 piece /
 * kurti, or the admin's own label when the type is "Other"). A gold hairline
 * on cream rather than a filled pill, so a grid of cards stays quiet.
 */
export default function ProductTypeBadge({
  productType,
  customType,
  className,
  size = "sm",
}: ProductTypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border border-brand-gold/40 bg-brand-cream font-medium uppercase tracking-[0.12em] text-brand-inkSoft",
        size === "sm" ? "px-2 py-0.5 text-[0.7rem]" : "px-3 py-1.5 text-xs",
        className
      )}
    >
      <span aria-hidden="true">{productTypeIcon(productType)}</span>
      {productTypeLabel(productType, customType)}
    </span>
  );
}
