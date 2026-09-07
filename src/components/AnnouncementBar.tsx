"use client";

import { useEffect, useState } from "react";
import { ANNOUNCEMENTS } from "@/lib/site-links";

/**
 * Thin promo strip above the header — the messages fade through one at a time
 * so several offers fit in one line of chrome without stacking bars.
 */
export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (ANNOUNCEMENTS.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length),
      4000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-brand-night text-white">
      <div
        className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 text-center sm:px-6 lg:px-8"
        aria-live="polite"
      >
        <p key={index} className="animate-[fade-in_.5s_ease] truncate text-xs font-semibold tracking-wide text-white/90">
          {ANNOUNCEMENTS[index]}
        </p>
      </div>
    </div>
  );
}
