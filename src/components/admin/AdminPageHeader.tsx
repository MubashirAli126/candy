import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  /** Small-caps label above the title. */
  eyebrow?: string;
  title: string;
  /** One line of supporting copy under the title. */
  subtitle?: string;
  /** Buttons or controls that belong on the title's own line. */
  actions?: React.ReactNode;
  /** A "← Back to …" link rendered above the eyebrow. */
  back?: React.ReactNode;
  className?: string;
}

/**
 * The house header for every admin screen — the storefront's SectionHeading
 * rearranged for a back office: left-aligned, with room for the page's actions
 * on the title's line, and a gold hairline instead of the centred diamond
 * ornament. Every admin page uses this rather than rolling its own heading, so
 * the two halves of the site read as one design and retune together.
 */
export default function AdminPageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  back,
  className,
}: AdminPageHeaderProps) {
  return (
    <header className={cn("mb-8", className)}>
      {back && <div className="mb-4">{back}</div>}

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1
            className={cn(
              "font-display text-[1.75rem] font-normal leading-[1.15] tracking-tight text-brand-ink sm:text-4xl",
              eyebrow && "mt-2"
            )}
          >
            {title}
          </h1>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>

      <div className="rule-gold mt-5 w-full" aria-hidden="true" />

      {subtitle && (
        <p className="mt-4 max-w-2xl text-sm text-brand-inkSoft">{subtitle}</p>
      )}
    </header>
  );
}
