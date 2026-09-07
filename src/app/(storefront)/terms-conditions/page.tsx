import type { Metadata } from "next";
import PolicyArticle from "@/components/PolicyArticle";
import { POLICIES } from "@/lib/policies";

const content = POLICIES["terms-conditions"];

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: "/terms-conditions" },
};

export default function Page() {
  return <PolicyArticle content={content} />;
}
