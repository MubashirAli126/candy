import type { Metadata } from "next";
import Link from "next/link";
import PolicyArticle from "@/components/PolicyArticle";
import JsonLd from "@/components/JsonLd";
import { CONTACTS, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQs",
  description: `Answers to the questions we are asked most at ${SITE_NAME} — delivery times, sizing, exchanges and cash on delivery.`,
  alternates: { canonical: "/faq" },
};

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "How long does delivery take?",
    a: "Orders are dispatched within 24 hours of confirmation. Karachi, Lahore and Islamabad usually receive the parcel in 2 to 3 working days; the rest of Pakistan in 3 to 5.",
  },
  {
    q: "Do you offer cash on delivery?",
    a: "Yes — every order is cash on delivery. Pay the courier when the parcel reaches you. We never ask for card details or an OTP.",
  },
  {
    q: "Is delivery free?",
    a: "Orders over Rs. 5,000 ship free. Below that, a flat delivery charge is shown at checkout before you confirm.",
  },
  {
    q: "Are the suits stitched or unstitched?",
    a: "Everything on this site is ready to wear — stitched and pressed, ready to slip on. We can also stitch to your own measurements on request.",
  },
  {
    q: "Which sizes do you carry?",
    a: "Small, Medium and Large. The Size Chart page lists the exact chest, waist and length measurements for each.",
  },
  {
    q: "Can I exchange an item if the size is wrong?",
    a: "Yes, within 7 days of delivery, as long as the item is unworn, unwashed and in its original packaging. Custom-stitched pieces cannot be exchanged.",
  },
  {
    q: "How do I track my order?",
    a: "Use the Track Your Order page with the order number we sent you and the phone number on the order.",
  },
  {
    q: "Do you sell wholesale?",
    a: `Yes — we are a wholesale ladies garments manufacturer. WhatsApp ${CONTACTS[0].display} for bulk rates.`,
  },
  {
    q: "Will the colour match the photo exactly?",
    a: "We photograph every outfit ourselves under natural light, but screens vary and prints are cut individually, so a slight difference in shade or motif placement is normal.",
  },
];

export default function FaqPage() {
  return (
    <PolicyArticle
      content={{
        title: "FAQs",
        intro: "The questions we get asked most, answered in plain language.",
      }}
    >
      {/* FAQPage schema so the answers can surface directly in Google. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      <div className="divide-y divide-black/5 border-y border-black/5">
        {FAQS.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-brand-dark sm:text-base">
              {f.q}
              <span
                aria-hidden="true"
                className="shrink-0 text-brand-pink transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">{f.a}</p>
          </details>
        ))}
      </div>

      <p className="text-sm text-gray-600 sm:text-base">
        Still stuck?{" "}
        <Link href="/contact" className="font-semibold text-brand-pink hover:underline">
          Contact us
        </Link>{" "}
        — we reply on WhatsApp within working hours.
      </p>
    </PolicyArticle>
  );
}
