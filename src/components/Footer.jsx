"use client";

export default function Footer() {
  return (
    <div style={{ background: "var(--noshd-charcoal)", position: "relative", overflow: "hidden" }}>
      {/* Decorative dots */}
      <svg style={{ position: "absolute", top: "15%", left: "6%", opacity: 0.08, pointerEvents: "none" }} width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="10" cy="10" r="4" fill="#FF5500" />
        <circle cx="40" cy="20" r="3" fill="#1010FF" />
        <circle cx="15" cy="50" r="5" fill="#FFF597" />
        <circle cx="60" cy="40" r="3" fill="#1010FF" />
      </svg>
      <svg style={{ position: "absolute", bottom: "12%", right: "8%", opacity: 0.08, pointerEvents: "none" }} width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="70" cy="15" r="5" fill="#FFF597" />
        <circle cx="30" cy="30" r="3" fill="#1010FF" />
        <circle cx="60" cy="55" r="4" fill="#1010FF" />
        <circle cx="20" cy="65" r="3" fill="#FF5500" />
      </svg>

      {/* Main tagline */}
      <div style={{ padding: "48px 24px 32px", textAlign: "center", position: "relative", zIndex: 2 }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px,3.5vw,28px)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.35, maxWidth: "600px", margin: "0 auto" }}>
          195 countries. thousands of restaurants. all hiding in{" "}
          <span style={{ color: "#FFF597", position: "relative", display: "inline-block" }}>
            your city
            <span style={{ position: "absolute", top: "-6px", left: "-8px", right: "-8px", bottom: "-4px", border: "2.5px solid #FFF597", borderRadius: "50% 45% 55% 40%", opacity: 0.35, transform: "rotate(-2deg)", pointerEvents: "none" }} />
          </span>.
        </p>
      </div>

      {/* Footer links + contact */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "24px 24px 32px", position: "relative", zIndex: 2 }}>
        <div className="footer-grid" style={{ maxWidth: "720px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "#FFFFFF", marginBottom: "8px" }}>noshd</div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>
              spin. discover. devour.<br />
              Chicago&apos;s guide to the world&apos;s cuisines.
            </p>
          </div>

          {/* Explore */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontFamily: "var(--font-body)" }}>explore</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}>spin the wheel</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}>browse by country</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}>create account</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontFamily: "var(--font-body)" }}>contact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <a href="mailto:hello@noshd.com" style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)", textDecoration: "none" }}>hello@noshd.com</a>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}>Chicago, IL</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ maxWidth: "720px", margin: "20px auto 0", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.5px" }}>
            &copy; 2026 noshd &middot; all rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
