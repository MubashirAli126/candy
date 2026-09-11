import Link from "next/link";

/**
 * The "← Back to …" link that sits above every admin detail screen's title.
 * One definition so the arrow, the tracking and the hover all match.
 */
export default function AdminBackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="link-underline inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-inkSoft transition-colors hover:text-brand-ink"
    >
      <span aria-hidden="true">←</span>
      {children}
    </Link>
  );
}
