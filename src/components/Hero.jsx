"use client";

export default function Hero() {
  return (
    <div style={{ background: "#FF5500", position: "relative", overflow: "hidden", padding: "56px 24px 48px" }}>
      <div className="grid-texture" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      {/* Smiley sticker */}
      <svg style={{ position: "absolute", top: "10%", right: "5%", opacity: 0.9, pointerEvents: "none" }} width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="#FFF597" />
        <path d="M22 30C22 30 26 40 32 40C38 40 42 30 42 30" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="25" r="2.5" fill="#1C1917" />
        <circle cx="40" cy="25" r="2.5" fill="#1C1917" />
      </svg>
      <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: "20px" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(52px,10vw,96px)", fontWeight: 400, color: "#FFFFFF", lineHeight: 0.95, display: "block" }}>noshd</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)" }}>/nɒʃd/</span>
          <span style={{ display: "inline-block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "20px", background: "rgba(255,255,255,0.15)", color: "#FFFFFF" }}>verb</span>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)" }}>past tense of <em>nosh</em></span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
          <div style={{ display: "flex", gap: "14px" }}>
            <span style={{ fontSize: "18px", color: "#FFF597", fontFamily: "var(--font-display)", minWidth: "16px" }}>1.</span>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.9)", lineHeight: "1.65", fontFamily: "var(--font-body)", margin: 0 }}>to have devoured a meal that hit every sense &mdash; the kind that earns the restaurant a permanent spot in your rotation.</p>
          </div>
          <div style={{ paddingLeft: "30px" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "15px", color: "rgba(255,255,255,0.55)" }}>&ldquo;i noshd vietnamese on argyle and the ph&#7903; broth was doing something spiritual.&rdquo;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
