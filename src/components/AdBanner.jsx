"use client";
import { useEffect, useRef } from "react";

const SIZES = {
  leaderboard: { format: "horizontal", style: { display: "block", width: "100%", maxWidth: "728px", height: "90px" } },
  rectangle: { format: "rectangle", style: { display: "block", width: "300px", height: "250px" } },
  mobile: { format: "horizontal", style: { display: "block", width: "100%", maxWidth: "320px", height: "50px" } },
};

export default function AdBanner({ size = "leaderboard", user }) {
  // Don't show ads for premium users
  if (user?.tier === "premium") return null;

  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch (e) {
      // AdSense not loaded yet — that's OK
    }
  }, []);

  const cfg = SIZES[size];
  return (
    <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <ins className="adsbygoogle"
        ref={adRef}
        style={cfg.style}
        data-ad-client="ca-pub-6523613570173583"
        data-ad-format={cfg.format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
