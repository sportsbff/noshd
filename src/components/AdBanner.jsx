"use client";

const SIZES = {
  leaderboard: { maxWidth: "728px", height: "90px", label: "728 × 90" },
  rectangle: { maxWidth: "300px", height: "250px", label: "300 × 250" },
  mobile: { maxWidth: "320px", height: "50px", label: "320 × 50" },
};

export default function AdBanner({ size = "leaderboard", user }) {
  // Don't show ads for premium users
  if (user?.tier === "premium") return null;

  const cfg = SIZES[size];
  return (
    <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: "9px", color: "var(--noshd-faint)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "4px", fontFamily: "var(--font-body)" }}>
        advertisement
      </div>
      <div style={{
        width: "100%", maxWidth: cfg.maxWidth, height: cfg.height,
        background: "var(--noshd-bg-alt)", border: "1px dashed var(--noshd-border)", borderRadius: "4px",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: "11px", color: "var(--noshd-grey-400)", fontFamily: "var(--font-body)" }}>
          ad &middot; {cfg.label}
        </span>
      </div>
    </div>
  );
}
