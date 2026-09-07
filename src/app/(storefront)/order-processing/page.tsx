import type { Metadata } from "next";
import PolicyArticle from "@/components/PolicyArticle";
import { POLICIES } from "@/lib/policies";

const content = POLICIES["order-processing"];

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: "/order-processing" },
};

export default function Page() {
  return <PolicyArticle content={content} />;
}
