"use client";
import { useState } from "react";
import { Shuffle, SlidersHorizontal } from "lucide-react";
import { ALL_COUNTRIES, COUNTRY_DATA } from "@/data/countries";
import { shuffle } from "@/lib/utils";

import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SpinWheel from "@/components/SpinWheel";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import CountryCustomizer from "@/components/CountryCustomizer";
import CountryBrowser from "@/components/CountryBrowser";
import CountryPage from "@/components/CountryPage";
import MyRestaurants from "@/components/MyRestaurants";

export default function Home() {
  const [view, setView] = useState("home");
  const [country, setCountry] = useState(null);
  const [tab, setTab] = useState("spin");
  const [wheelCountries, setWheelCountries] = useState(() => shuffle(ALL_COUNTRIES).slice(0, 14));
  const [spinResult, setSpinResult] = useState(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState({});
  const [wheelFilter, setWheelFilter] = useState("all");
  const [browseView, setBrowseView] = useState("grid");

  const handleAuth = (u) => { setUser(u); setShowAuth(false); };
  const handleSave = (key, data) => setSaved(prev => ({ ...prev, [key]: data }));
  const handleRemove = (key) => setSaved(prev => { const n = { ...prev }; delete n[key]; return n; });
  const goCountry = (c) => { setCountry(c); setView("country"); window.scrollTo(0, 0); };
  const goHome = () => { setView("home"); setCountry(null); };
  const savedCount = Object.keys(saved).length;

  const savedCountrySet = new Set(Object.keys(saved).map(k => k.split("||")[0]));
  const favCountrySet = new Set(
    Object.entries(saved).filter(([, v]) => v.status === "favorite").map(([k]) => k.split("||")[0])
  );

  let effectiveWheelCountries = wheelCountries;
  if (user && wheelFilter === "no-visited") {
    const filtered = wheelCountries.filter(c => !savedCountrySet.has(c));
    effectiveWheelCountries = filtered.length >= 3 ? filtered : wheelCountries;
  } else if (user && wheelFilter === "favorites") {
    const filtered = wheelCountries.filter(c => favCountrySet.has(c));
    effectiveWheelCountries = filtered.length >= 3 ? filtered : wheelCountries;
  }

  const doRandomize = () => {
    setWheelCountries(shuffle(ALL_COUNTRIES).slice(0, 14));
    setSpinResult(null);
    setWheelFilter("all");
  };

  const navTab = (id, label) => (
    <button key={id} onClick={() => setTab(id)}
      style={{
        padding: "14px 0",
        border: "none",
        background: "none",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: tab === id ? 600 : 400,
        fontFamily: "var(--font-body)",
        color: tab === id ? "#FFFFFF" : "rgba(255,255,255,0.45)",
        borderBottom: `2px solid ${tab === id ? "#FFF597" : "transparent"}`,
        marginBottom: "-1px",
        textTransform: "lowercase",
        transition: "color 0.15s",
      }}>
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--noshd-white)", fontFamily: "var(--font-body)", color: "var(--noshd-charcoal)" }}>
      <Nav user={user} savedCount={savedCount} onShowAuth={() => setShowAuth(true)} onGoHome={goHome}
        onMyRestaurants={() => { setTab("my"); setView("home"); }}
        onSignOut={() => { setUser(null); setSaved({}); }}
        showHome={view === "country" || tab === "my"} />

      {/* Country Page */}
      {view === "country" && country && (
        <main style={{ padding: "28px 20px 0" }}>
          <CountryPage country={country} user={user} saved={saved} onSave={handleSave} onRemove={handleRemove} onBack={goHome} />
        </main>
      )}

      {/* Home */}
      {view === "home" && (
        <main>
          {/* Hero — always visible */}
          <Hero />

          {/* Tab nav — charcoal strip below hero */}
          <div style={{ background: "var(--noshd-charcoal)", position: "relative" }}>
            <div className="tab-nav" style={{ padding: "0 24px", display: "flex", gap: "24px", borderBottom: "1px solid rgba(255,255,255,0.08)", overflow: "auto", WebkitOverflowScrolling: "touch" }}>
              {navTab("spin", "spin the wheel")}
              {navTab("browse", "browse by country")}
              {user && navTab("my", `my restaurants${savedCount > 0 ? ` (${savedCount})` : ""}`)}
            </div>
          </div>

          {/* Tab content */}
          {tab === "spin" && (
            <>
              {/* Wheel panel — cream bg */}
              <div id="wheel-section" style={{ background: "var(--noshd-cream)" }}>
                <div style={{ padding: "36px 24px 48px" }}>
                  <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                    {/* Controls */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "24px" }}>
                      <button onClick={doRandomize}
                        style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(28,25,23,0.05)", border: "1.5px solid var(--noshd-border)", color: "var(--noshd-muted)", borderRadius: "4px", padding: "7px 16px", fontSize: "12px", cursor: "pointer", fontWeight: 600, fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
                        <Shuffle size={12} /> randomize
                      </button>
                      <button onClick={() => setShowCustomizer(true)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(28,25,23,0.05)", border: "1.5px solid var(--noshd-border)", color: "var(--noshd-muted)", borderRadius: "4px", padding: "7px 16px", fontSize: "12px", cursor: "pointer", fontWeight: 600, fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
                        <SlidersHorizontal size={12} /> customize ({wheelCountries.length})
                      </button>
                    </div>

                    {/* Wheel filter */}
                    {user && (
                      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "24px", flexWrap: "wrap" }}>
                        <div style={{ fontSize: "11px", color: "var(--noshd-faint)", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "var(--font-body)", alignSelf: "center", marginRight: "4px" }}>spin</div>
                        {[["all", "all countries"], ["no-visited", "skip visited"], ["favorites", "favorites only"]].map(([v, label]) => (
                          <button key={v} onClick={() => { setWheelFilter(v); setSpinResult(null); }}
                            style={{
                              padding: "6px 14px",
                              border: `1.5px solid ${wheelFilter === v ? "var(--noshd-accent)" : "var(--noshd-border)"}`,
                              borderRadius: "50px",
                              background: wheelFilter === v ? "var(--noshd-accent-bg)" : "transparent",
                              color: wheelFilter === v ? "var(--noshd-accent)" : "var(--noshd-muted)",
                              fontSize: "12px", fontWeight: 600, cursor: "pointer",
                              fontFamily: "var(--font-body)", textTransform: "lowercase",
                            }}>
                            {label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Filter warning */}
                    {user && wheelFilter !== "all" && effectiveWheelCountries === wheelCountries && (
                      <div style={{ textAlign: "center", fontSize: "11px", marginBottom: "16px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)" }}>
                        {wheelFilter === "favorites" ? "no favorites yet — showing all" : "not enough unvisited — showing all"}
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <SpinWheel key={effectiveWheelCountries.join(",")} countries={effectiveWheelCountries} onResult={setSpinResult} />
                    </div>
                    <div style={{ textAlign: "center", marginTop: "16px", fontSize: "11px", color: "var(--noshd-faint)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-body)" }}>
                      195 countries &middot; chicago
                    </div>
                  </div>
                </div>
              </div>

              {/* Spin result */}
              {spinResult && (
                <div style={{ background: "#fff", borderBottom: "1px solid var(--noshd-border)", padding: "28px 24px", animation: "fadeUp 0.3s ease" }}>
                  <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "12px" }}>
                      <span style={{ fontSize: "40px", lineHeight: 1 }}>{COUNTRY_DATA[spinResult]?.flag}</span>
                      <div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, color: "var(--noshd-charcoal)", marginBottom: "3px" }}>{spinResult}</h2>
                        <div style={{ color: "var(--noshd-faint)", fontSize: "12px", fontFamily: "var(--font-body)" }}>{COUNTRY_DATA[spinResult]?.restaurants?.length} spots in chicago</div>
                      </div>
                    </div>
                    <p style={{ color: "var(--noshd-muted)", fontSize: "14px", lineHeight: 1.7, marginBottom: "16px", fontFamily: "var(--font-body)" }}>{COUNTRY_DATA[spinResult]?.description}</p>
                    <button onClick={() => goCountry(spinResult)}
                      style={{ background: "var(--noshd-charcoal)", color: "white", border: "2px solid var(--noshd-charcoal)", borderRadius: "4px", padding: "10px 24px", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
                      see restaurants →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {tab === "browse" && (
            <div style={{ padding: "28px 24px", maxWidth: "860px", margin: "0 auto", animation: "fadeUp 0.3s ease" }}>
              <CountryBrowser savedCountrySet={savedCountrySet} favCountrySet={favCountrySet} onSelectCountry={goCountry}
                browseView={browseView} setBrowseView={setBrowseView} />
            </div>
          )}

          {tab === "my" && user && (
            <div style={{ padding: "28px 20px 0", animation: "fadeUp 0.3s ease" }}>
              <MyRestaurants user={user} saved={saved} onSave={handleSave} onRemove={handleRemove} onBack={goHome} />
            </div>
          )}

          {/* Footer */}
          <Footer />
        </main>
      )}

      {/* Modals */}
      {showCustomizer && (
        <CountryCustomizer selected={wheelCountries}
          onApply={l => { setWheelCountries(shuffle(l)); setShowCustomizer(false); setSpinResult(null); }}
          onClose={() => setShowCustomizer(false)} />
      )}
      {showAuth && <AuthModal onAuth={handleAuth} onClose={() => setShowAuth(false)} />}
    </div>
  );
}
