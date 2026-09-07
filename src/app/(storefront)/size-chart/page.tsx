import type { Metadata } from "next";
import Link from "next/link";
import PolicyArticle from "@/components/PolicyArticle";
import { CONTACTS, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Size Chart",
  description: `Measurements for ${SITE_NAME} stitched suits and kurtis — Small, Medium and Large, with how to measure yourself.`,
  alternates: { canonical: "/size-chart" },
};

/** All measurements in inches, matching the fixed Small/Medium/Large range. */
const SHIRT_ROWS = [
  { size: "Small", chest: "36–38", waist: "32–34", length: "38–40", shoulder: "14" },
  { size: "Medium", chest: "38–40", waist: "34–36", length: "40–42", shoulder: "15" },
  { size: "Large", chest: "40–44", waist: "36–40", length: "42–44", shoulder: "16" },
];

const TROUSER_ROWS = [
  { size: "Small", waist: "28–30", hip: "38–40", length: "38" },
  { size: "Medium", waist: "30–34", hip: "40–42", length: "39" },
  { size: "Large", waist: "34–38", hip: "42–46", length: "40" },
];

export default function SizeChartPage() {
  return (
    <PolicyArticle
      content={{
        title: "Size Chart",
        intro:
          "Every measurement below is in inches and refers to the body, not the garment — our stitching already allows the ease.",
      }}
    >
      <SizeTable
        caption="Shirt / Kurti"
        columns={["Size", "Chest", "Waist", "Length", "Shoulder"]}
        rows={SHIRT_ROWS.map((r) => [r.size, r.chest, r.waist, r.length, r.shoulder])}
      />

      <SizeTable
        caption="Trouser"
        columns={["Size", "Waist", "Hip", "Length"]}
        rows={TROUSER_ROWS.map((r) => [r.size, r.waist, r.hip, r.length])}
      />

      <section>
        <h2 className="font-display text-lg font-bold text-brand-plum sm:text-xl">
          How to measure
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600 sm:text-base">
          <li>
            <strong>Chest:</strong> around the fullest part, keeping the tape
            level under the arms.
          </li>
          <li>
            <strong>Waist:</strong> around the narrowest part of your waistline.
          </li>
          <li>
            <strong>Hip:</strong> around the fullest part of the hips.
          </li>
          <li>
            <strong>Length:</strong> from the shoulder seam straight down to
            where you want the hem to sit.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-lg font-bold text-brand-plum sm:text-xl">
          Between two sizes?
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Go one size up — a stitched suit is easier to take in than to let out.
          We also stitch to your own measurements: WhatsApp them to us on{" "}
          {CONTACTS[0].display} before placing the order. Note that
          custom-stitched pieces cannot be exchanged, so please check the numbers
          twice.
        </p>
        <Link
          href="/exchange-policy"
          className="mt-3 inline-block text-sm font-semibold text-brand-pink hover:underline"
        >
          Read the exchange policy →
        </Link>
      </section>
    </PolicyArticle>
  );
}

/** A responsive measurement table — scrolls sideways rather than squashing. */
function SizeTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: string[][];
}) {
  return (
    <section>
      <h2 className="font-display text-lg font-bold text-brand-plum sm:text-xl">
        {caption}{" "}
        <span className="text-sm font-medium text-gray-400">(inches)</span>
      </h2>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="bg-brand-mist text-left">
              {columns.map((c) => (
                <th
                  key={c}
                  className="border border-black/5 px-3 py-2 font-bold uppercase tracking-wide text-brand-dark"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={
                      i === 0
                        ? "border border-black/5 px-3 py-2 font-bold text-brand-dark"
                        : "border border-black/5 px-3 py-2 text-gray-600"
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
