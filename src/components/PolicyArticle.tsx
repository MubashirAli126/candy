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
      <h1 className="text-center font-display text-2xl font-extrabold uppercase tracking-[0.14em] text-brand-dark sm:text-3xl">
        {content.title}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-gray-500 sm:text-base">
        {content.intro}
      </p>

      <div className="mt-8 space-y-8 sm:mt-12">
        {content.sections?.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-lg font-bold text-brand-plum sm:text-xl">
              {section.heading}
            </h2>
            <div className="mt-2 space-y-3">
              {section.body.map((block, i) =>
                Array.isArray(block) ? (
                  <ul
                    key={i}
                    className="list-disc space-y-1 pl-5 text-sm text-gray-600 sm:text-base"
                  >
                    {block.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} className="text-sm text-gray-600 sm:text-base">
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
