"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useAnnouncer() {
  const [message, setMessage] = useState("");
  const timer = useRef<number | undefined>(undefined);

  const announce = useCallback((text: string) => {
    window.clearTimeout(timer.current);
    setMessage("");
    timer.current = window.setTimeout(() => setMessage(text), 50);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { message, announce };
}

export function LiveRegion({ message, visible = false }: { message: string; visible?: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={visible ? "mt-3 text-xs text-zinc-500 dark:text-zinc-400" : "sr-only"}
    >
      {message}
    </div>
  );
}