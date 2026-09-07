import type { Metadata } from "next";
import PolicyArticle from "@/components/PolicyArticle";
import { POLICIES } from "@/lib/policies";

const content = POLICIES["exchange-policy"];

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: "/exchange-policy" },
};

export default function Page() {
  return <PolicyArticle content={content} />;
}
