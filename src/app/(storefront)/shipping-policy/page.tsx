import type { Metadata } from "next";
import PolicyArticle from "@/components/PolicyArticle";
import { POLICIES } from "@/lib/policies";

const content = POLICIES["shipping-policy"];

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: "/shipping-policy" },
};

export default function Page() {
  return <PolicyArticle content={content} />;
}
