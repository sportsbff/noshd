"use client";

export default function Footer({ onSpin, onBrowse, onShowAuth }) {
  return (
    <>
      {/* Blue banner — "195 countries" tagline */}
      <div style={{ background: "var(--noshd-electra)", position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", top: "15%", left: "6%", opacity: 0.12, pointerEvents: "none" }} width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="10" cy="10" r="4" fill="#FF5500" />
          <circle cx="40" cy="20" r="3" fill="#FFF597" />
          <circle cx="15" cy="50" r="5" fill="#FFF597" />
          <circle cx="60" cy="40" r="3" fill="#A4DDFF" />
        </svg>
        <svg style={{ position: "absolute", bottom: "12%", right: "8%", opacity: 0.12, pointerEvents: "none" }} width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="70" cy="15" r="5" fill="#FFF597" />
          <circle cx="30" cy="30" r="3" fill="#A4DDFF" />
          <circle cx="60" cy="55" r="4" fill="#FF5500" />
          <circle cx="20" cy="65" r="3" fill="#FFF597" />
        </svg>
        <div style={{ padding: "48px 24px", textAlign: "center", position: "relative", zIndex: 2 }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px,3.5vw,28px)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.35, maxWidth: "600px", margin: "0 auto" }}>
            195 countries. thousands of restaurants. all hiding in{" "}
            <span style={{ color: "#FFF597", position: "relative", display: "inline-block" }}>
              your city
              <span style={{ position: "absolute", top: "-6px", left: "-8px", right: "-8px", bottom: "-4px", border: "2.5px solid #FFF597", borderRadius: "50% 45% 55% 40%", opacity: 0.35, transform: "rotate(-2deg)", pointerEvents: "none" }} />
            </span>.
          </p>
        </div>
      </div>

      {/* Black footer — links, contact, copyright */}
      <div style={{ background: "var(--noshd-charcoal)", position: "relative" }}>
        <div style={{ padding: "32px 24px 24px", position: "relative", zIndex: 2 }}>
          <div className="footer-grid" style={{ maxWidth: "720px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
            {/* Brand */}
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "#FFFFFF", marginBottom: "8px" }}>noshd</div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>
                spin. discover. devour.<br />
                Chicago&apos;s guide to the world&apos;s cuisines.
              </p>
            </div>

            {/* Explore */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontFamily: "var(--font-body)" }}>explore</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button onClick={onSpin} style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "inherit", textTransform: "lowercase" }}>spin the wheel</button>
                <button onClick={onBrowse} style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "inherit", textTransform: "lowercase" }}>browse by country</button>
                <button onClick={onShowAuth} style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "inherit", textTransform: "lowercase" }}>create account</button>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontFamily: "var(--font-body)" }}>contact</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <a href="mailto:noshdapp@gmail.com" style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)", textDecoration: "none" }}>noshdapp@gmail.com</a>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)" }}>Chicago, IL</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div style={{ maxWidth: "720px", margin: "20px auto 0", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.5px" }}>
              &copy; 2026 noshd &middot; all rights reserved
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
