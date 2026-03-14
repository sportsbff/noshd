"use client";
import { useState } from "react";
import { User, ChevronDown, Bookmark, LogOut, Menu, X, MapPin } from "lucide-react";

export default function Nav({ user, savedCount, onShowAuth, onGoHome, onMyRestaurants, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ background: "#FF5500", position: "relative" }}>
          <div className="grid-texture" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
          <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
            {/* Logo */}
            <div onClick={onGoHome} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "24px", letterSpacing: "-1px", color: "#FFFFFF", lineHeight: 1 }}>noshd</div>
              <div className="nav-chicago" style={{ position: "relative", borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: "10px" }}>
                <button onClick={(e) => { e.stopPropagation(); setCityOpen(!cityOpen); }}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "rgba(255,255,255,0.5)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-body)", padding: 0 }}>
                  <MapPin size={10} /> chicago <ChevronDown size={8} />
                </button>
                {cityOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#fff", border: "1px solid var(--noshd-border)", borderRadius: "4px", minWidth: "160px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", zIndex: 300, overflow: "hidden" }}>
                    <div style={{ padding: "10px 14px", fontSize: "13px", fontWeight: 600, color: "var(--noshd-tangerine)", fontFamily: "var(--font-body)", textTransform: "lowercase", display: "flex", alignItems: "center", gap: "6px" }}>
                      <MapPin size={12} /> chicago
                    </div>
                    <div style={{ borderTop: "1px solid var(--noshd-border)" }}>
                      <div style={{ padding: "10px 14px", fontSize: "12px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)", textTransform: "lowercase", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        los angeles <span style={{ fontSize: "9px", background: "var(--noshd-banana)", color: "var(--noshd-charcoal)", padding: "1px 6px", borderRadius: "2px", fontWeight: 700, letterSpacing: "0.5px" }}>soon</span>
                      </div>
                      <div style={{ padding: "10px 14px", fontSize: "12px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)", textTransform: "lowercase", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        new york <span style={{ fontSize: "9px", background: "var(--noshd-banana)", color: "var(--noshd-charcoal)", padding: "1px 6px", borderRadius: "2px", fontWeight: 700, letterSpacing: "0.5px" }}>soon</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop nav */}
            <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {user ? (
                <div style={{ position: "relative" }}>
                  <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: "4px", padding: "7px 12px", cursor: "pointer", fontSize: "13px", color: "#FFFFFF", fontWeight: 600, fontFamily: "var(--font-body)" }}>
                    <User size={14} /><span className="nav-user-name">{user.name}</span>
                    {user.tier === "premium" && <span style={{ background: "rgba(0,0,0,0.3)", color: "#FFF597", fontSize: "10px", padding: "1px 6px", borderRadius: "2px", fontWeight: 700, fontFamily: "var(--font-body)" }}>pro</span>}
                    <ChevronDown size={12} color="rgba(255,255,255,0.6)" />
                  </button>
                  {menuOpen && (
                    <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "#fff", border: "1px solid var(--noshd-border)", borderRadius: "4px", minWidth: "180px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", zIndex: 300, overflow: "hidden" }} onClick={() => setMenuOpen(false)}>
                      <button onClick={() => { onMyRestaurants(); setMenuOpen(false); }} style={{ width: "100%", padding: "11px 16px", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", color: "var(--noshd-charcoal)", fontWeight: 600, fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
                        <Bookmark size={13} />my restaurants
                        {savedCount > 0 && <span style={{ background: "#FF5500", color: "white", fontSize: "10px", padding: "1px 6px", borderRadius: "10px" }}>{savedCount}</span>}
                      </button>
                      <button onClick={() => { onSignOut(); setMenuOpen(false); }} style={{ width: "100%", padding: "11px 16px", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", color: "var(--noshd-muted)", borderTop: "1px solid var(--noshd-border)", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
                        <LogOut size={13} />sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={onShowAuth} style={{ background: "none", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: "4px", padding: "7px 14px", cursor: "pointer", fontSize: "13px", color: "rgba(255,255,255,0.8)", fontWeight: 600, fontFamily: "var(--font-body)", textTransform: "lowercase" }}>sign in</button>
                  <button onClick={onShowAuth} className="nav-create-btn" style={{ background: "#FFFFFF", color: "#FF5500", border: "2px solid #FFFFFF", borderRadius: "4px", padding: "7px 14px", cursor: "pointer", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-body)", textTransform: "lowercase" }}>create account</button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button className="nav-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#FFFFFF", padding: "4px", display: "none" }}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="nav-mobile-menu" style={{ padding: "0 16px 16px", position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {user ? (
                  <>
                    <button onClick={() => { onMyRestaurants(); setMobileMenuOpen(false); }}
                      style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", color: "#FFFFFF", fontWeight: 600, fontFamily: "var(--font-body)", textTransform: "lowercase", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Bookmark size={14} />my restaurants
                      {savedCount > 0 && <span style={{ background: "rgba(0,0,0,0.3)", color: "#FFF597", fontSize: "10px", padding: "2px 8px", borderRadius: "10px" }}>{savedCount}</span>}
                    </button>
                    <button onClick={() => { onSignOut(); setMobileMenuOpen(false); }}
                      style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)", textTransform: "lowercase", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}>
                      <LogOut size={14} />sign out
                    </button>
                  </>
                ) : (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => { onShowAuth(); setMobileMenuOpen(false); }}
                      style={{ flex: 1, padding: "10px", background: "none", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: "4px", cursor: "pointer", fontSize: "13px", color: "rgba(255,255,255,0.9)", fontWeight: 600, fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
                      sign in
                    </button>
                    <button onClick={() => { onShowAuth(); setMobileMenuOpen(false); }}
                      style={{ flex: 1, padding: "10px", background: "#FFFFFF", color: "#FF5500", border: "2px solid #FFFFFF", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
                      create account
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {menuOpen && <div style={{ position: "fixed", inset: 0, zIndex: 199 }} onClick={() => setMenuOpen(false)} />}
      {mobileMenuOpen && <div style={{ position: "fixed", inset: 0, zIndex: 199 }} onClick={() => setMobileMenuOpen(false)} />}
      {cityOpen && <div style={{ position: "fixed", inset: 0, zIndex: 199 }} onClick={() => setCityOpen(false)} />}
    </>
  );
}
