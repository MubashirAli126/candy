/**
 * Renders a JSON-LD structured-data <script> tag.
 * Centralises the `dangerouslySetInnerHTML` pattern so pages don't repeat it.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: it escapes `<` only partially, so we
      // additionally guard against `</script>` breakout by replacing `<`.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
