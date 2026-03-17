import { useEffect, useRef } from "react";
import { trackScrollDepth } from "@/lib/analytics";

export function useScrollDepth() {
  const fired50 = useRef(false);
  const fired90 = useRef(false);

  useEffect(() => {
    fired50.current = false;
    fired90.current = false;

    const sentinels = new Map<HTMLElement, 50 | 90>();

    function createSentinel(percent: 50 | 90): HTMLElement {
      const el = document.createElement("div");
      el.style.cssText = "position:absolute;width:1px;height:1px;pointer-events:none;";
      el.style.top = `${percent}%`;
      document.body.appendChild(el);
      sentinels.set(el, percent);
      return el;
    }

    const s50 = createSentinel(50);
    const s90 = createSentinel(90);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const pct = sentinels.get(el);
        if (pct === 50 && !fired50.current) {
          fired50.current = true;
          trackScrollDepth(50);
        }
        if (pct === 90 && !fired90.current) {
          fired90.current = true;
          trackScrollDepth(90);
        }
      });
    });

    observer.observe(s50);
    observer.observe(s90);

    return () => {
      observer.disconnect();
      s50.remove();
      s90.remove();
    };
  }, []);
}
