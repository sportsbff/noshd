"use client";

const SIZES = {
  leaderboard: { maxWidth: "728px", height: "90px", label: "728 x 90" },
  rectangle: { maxWidth: "300px", height: "250px", label: "300 x 250" },
  mobile: { maxWidth: "320px", height: "50px", label: "320 x 50" },
};

export default function AdBanner({ size = "leaderboard" }) {
  const cfg = SIZES[size];
  return (
    <div className="flex flex-col items-center mx-auto py-2">
      <div className="text-[9px] uppercase tracking-[1.5px] mb-0.5" style={{ color: "var(--noshd-grey-400)", fontFamily: "var(--font-body)" }}>
        Advertisement
      </div>
      <div className="w-full flex items-center justify-center rounded-sm" style={{
        maxWidth: cfg.maxWidth, height: cfg.height,
        background: "#F0EDE8", border: "1px solid var(--noshd-grey-200)"
      }}>
        <span className="text-xs" style={{ color: "var(--noshd-grey-400)", fontFamily: "var(--font-body)" }}>
          Ad &middot; {cfg.label}
        </span>
      </div>
    </div>
  );
}
