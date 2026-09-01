import { SOCIAL_HANDLE, SOCIALS } from "@/lib/seo";

/** Brand-mark paths for the three networks printed on the business card. */
const NETWORKS = [
  {
    key: "facebook",
    label: "Facebook",
    href: SOCIALS.facebook,
    path: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06z",
  },
  {
    key: "instagram",
    label: "Instagram",
    href: SOCIALS.instagram,
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 01-1.38-.9 3.8 3.8 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.24a6.6 6.6 0 100 13.2 6.6 6.6 0 000-13.2zm0 10.89a4.29 4.29 0 110-8.58 4.29 4.29 0 010 8.58zm8.4-11.15a1.54 1.54 0 11-3.08 0 1.54 1.54 0 013.08 0z",
  },
  {
    key: "tiktok",
    label: "TikTok",
    href: SOCIALS.tiktok,
    path: "M16.6 5.82A4.28 4.28 0 0115.54 3h-3.09v12.4a2.59 2.59 0 01-2.59 2.5 2.59 2.59 0 112.59-2.6V12.2a5.66 5.66 0 00-.85-.06 5.68 5.68 0 105.68 5.68V9.4a7.35 7.35 0 004.29 1.37V7.68a4.28 4.28 0 01-2.97-1.86z",
  },
] as const;

/**
 * Facebook / Instagram / TikTok links. All three point at the single handle the
 * shop prints on its card, so they live together in one small component.
 */
export default function SocialLinks({
  className = "",
  tone = "light",
  showHandle = false,
}: {
  className?: string;
  /** "dark" for the plum footer. */
  tone?: "light" | "dark";
  /** Show the @handle next to the icons (contact page). */
  showHandle?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {NETWORKS.map((n) => (
        <a
          key={n.key}
          href={n.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${n.label} — ${SOCIAL_HANDLE}`}
          className={`grid h-9 w-9 place-items-center rounded-full transition-transform hover:scale-110 ${
            tone === "dark"
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-brand-mist text-brand-logoRed hover:bg-brand-blush"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d={n.path} />
          </svg>
        </a>
      ))}
      {showHandle && (
        <span
          className={`ml-1 text-sm font-medium ${
            tone === "dark" ? "text-white/70" : "text-brand-purple"
          }`}
        >
          {SOCIAL_HANDLE}
        </span>
      )}
    </div>
  );
}
