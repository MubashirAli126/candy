import SectionHeading from "./SectionHeading";
import type { PolicyPageContent } from "@/lib/policies";

/**
 * Shared renderer for every static information page — policies, order
 * processing and the like. One layout means the whole set stays visually
 * identical no matter how many pages get added.
 */
export default function PolicyArticle({
  content,
  children,
}: {
  content: Pick<PolicyPageContent, "title" | "intro"> &
    Partial<Pick<PolicyPageContent, "sections">>;
  /** Extra markup appended after the sections (tables, forms, FAQs). */
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <SectionHeading
        as="h1"
        eyebrow="Candy"
        title={content.title}
        subtitle={content.intro}
      />

      <div className="mt-9 space-y-8 sm:mt-12">
        {content.sections?.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl leading-snug text-brand-ink sm:text-2xl">
              {section.heading}
            </h2>
            <span
              className="mt-3 block h-px w-10 bg-brand-gold/60"
              aria-hidden="true"
            />
            <div className="mt-4 space-y-3">
              {section.body.map((block, i) =>
                Array.isArray(block) ? (
                  <ul
                    key={i}
                    className="space-y-2 text-sm text-brand-inkSoft sm:text-base"
                  >
                    {block.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[0.65em] h-1 w-1 shrink-0 rotate-45 bg-brand-gold"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    key={i}
                    className="text-sm leading-relaxed text-brand-inkSoft sm:text-base"
                  >
                    {block}
                  </p>
                )
              )}
            </div>
          </section>
        ))}
        {children}
      </div>
    </div>
  );
}
