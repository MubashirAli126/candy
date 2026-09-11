import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small-caps label above the title. */
  eyebrow?: string;
  title: string;
  /** One line of supporting copy under the title. */
  subtitle?: string;
  align?: "center" | "left";
  /** Renders light-on-dark, for use over the plum surfaces. */
  tone?: "light" | "dark";
  /** Heading level — pages use h1, sections inside them use h2. */
  as?: "h1" | "h2";
  className?: string;
}

/**
 * The house section header: a champagne eyebrow, a serif title and a hairline
 * rule with a small diamond. Every page uses this instead of rolling its own
 * heading block, so the vertical rhythm and the ornament stay identical
 * site-wide and can be retuned from one file.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        centered ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className={cn("eyebrow", dark && "text-brand-goldSoft")}>{eyebrow}</p>
      )}
      <Tag
        className={cn(
          "font-display font-normal leading-[1.15] tracking-tight",
          eyebrow ? "mt-3" : "",
          Tag === "h1"
            ? "text-[2rem] sm:text-5xl"
            : "text-[1.75rem] sm:text-4xl",
          dark ? "text-white" : "text-brand-ink"
        )}
      >
        {title}
      </Tag>

      {/* Ornament: hairline · diamond · hairline */}
      <div
        className={cn(
          "mt-4 flex items-center gap-3",
          centered ? "justify-center" : "justify-start"
        )}
        aria-hidden="true"
      >
        {centered && <span className="rule-gold w-14 sm:w-20" />}
        <span
          className={cn(
            "h-1.5 w-1.5 rotate-45",
            dark ? "bg-brand-goldSoft" : "bg-brand-gold"
          )}
        />
        <span className="rule-gold w-14 sm:w-20" />
      </div>

      {subtitle && (
        <p
          className={cn(
            "mt-4 text-sm sm:text-base",
            centered && "mx-auto max-w-xl",
            dark ? "text-white/70" : "text-brand-inkSoft"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
