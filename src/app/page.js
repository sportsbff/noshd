"use client";
import { useState, useEffect, useCallback } from "react";
import { Shuffle, SlidersHorizontal } from "lucide-react";
import { ALL_COUNTRIES, COUNTRY_DATA } from "@/data/countries";
import { shuffle } from "@/lib/utils";
import { supabase, getSession, getProfile, loadSaved, saveToDB, removeFromDB, signOut as supaSignOut, onAuthStateChange } from "@/lib/supabase";

import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SpinWheel from "@/components/SpinWheel";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import CountryCustomizer from "@/components/CountryCustomizer";
import CountryBrowser from "@/components/CountryBrowser";
import CountryPage from "@/components/CountryPage";
import MyRestaurants from "@/components/MyRestaurants";
import AccountPage from "@/components/AccountPage";
import AdBanner from "@/components/AdBanner";

export default function Home() {
  const [view, setView] = useState("home");
  const [country, setCountry] = useState(null);
  const [tab, setTab] = useState("spin");
  const [wheelCountries, setWheelCountries] = useState(() => shuffle(ALL_COUNTRIES).slice(0, 14));
  const [spinResult, setSpinResult] = useState(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState({});
  const [wheelFilter, setWheelFilter] = useState("all");
  const [browseView, setBrowseView] = useState("grid");

  // Restore session from Supabase on mount + listen for auth changes
  useEffect(() => {
    let cancelled = false;

    const restoreUser = async (sessionUser) => {
      if (cancelled || !sessionUser) return;
      const p = await getProfile(sessionUser.id);
      const name = p?.name || sessionUser.user_metadata?.name || sessionUser.email?.split("@")[0] || "User";
      const tier = p?.tier || sessionUser.user_metadata?.tier || "free";
      if (!cancelled) {
        setUser({ name, tier, email: sessionUser.email, id: sessionUser.id });
        setProfile(p || { id: sessionUser.id, name, tier, email: sessionUser.email });
      }
      const savedData = await loadSaved(sessionUser.id);
      if (!cancelled) setSaved(savedData);
    };

    // Check existing session first
    getSession().then(({ data }) => {
      if (data?.session?.user) restoreUser(data.session.user);
    });

    // Listen for auth state changes (handles token refresh, sign in/out)
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        restoreUser(session.user);
      } else if (event === "SIGNED_OUT") {
        if (!cancelled) {
          setUser(null);
          setProfile(null);
          setSaved({});
        }
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        // Session was refreshed — user stays logged in
        restoreUser(session.user);
      }
    });

    return () => { cancelled = true; subscription?.unsubscribe(); };
  }, []);

  const handleAuth = useCallback((u) => {
    setUser(u);
    setProfile(u.id ? { id: u.id, name: u.name, tier: u.tier, email: u.email } : null);
    setShowAuth(false);
    // Load saved data if Supabase user
    if (u.id) {
      loadSaved(u.id).then(data => setSaved(data));
    }
  }, []);

  const handleSave = useCallback((key, data) => {
    setSaved(prev => ({ ...prev, [key]: data }));
    if (user?.id) saveToDB(user.id, key, data);
  }, [user]);

  const handleRemove = useCallback((key) => {
    setSaved(prev => { const n = { ...prev }; delete n[key]; return n; });
    if (user?.id) removeFromDB(user.id, key);
  }, [user]);

  const goCountry = (c) => { setCountry(c); setView("country"); window.scrollTo(0, 0); };
  const goHome = () => { setView("home"); setCountry(null); };
  const savedCount = Object.keys(saved).length;

  const handleSignOut = async () => {
    await supaSignOut();
    setUser(null);
    setProfile(null);
    setSaved({});
    setView("home");
    setTab("spin");
  };

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

  const navTab = (id, label) => {
    const active = tab === id;
    return (
      <button key={id} onClick={() => setTab(id)}
        style={{
          padding: "12px 14px 13px",
          border: active ? "1px solid var(--noshd-border)" : "1px solid transparent",
          borderBottom: active ? "none" : "1px solid transparent",
          borderRadius: "6px 6px 0 0",
          background: active ? "#fff" : "transparent",
          cursor: "pointer",
          fontSize: "13px",
          lineHeight: "1.1",
          fontWeight: active ? 600 : 400,
          fontFamily: "var(--font-body)",
          color: active ? "var(--noshd-electra)" : "rgba(28,25,23,0.55)",
          marginBottom: "-1px",
          textTransform: "lowercase",
          transition: "all 0.15s",
          position: "relative",
          whiteSpace: "nowrap",
          zIndex: active ? 2 : 1,
        }}>
        {label}
      </button>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--noshd-white)", fontFamily: "var(--font-body)", color: "var(--noshd-charcoal)" }}>
      {/* Ad — above header */}
      <AdBanner size="leaderboard" user={user} />

      <Nav user={user} savedCount={savedCount} onShowAuth={() => setShowAuth(true)} onGoHome={goHome}
        onMyRestaurants={() => { setTab("my"); setView("home"); }}
        onAccount={() => setView("account")}
        onSignOut={handleSignOut} />

      {/* Account Page */}
      {view === "account" && user && (
        <>
          <main style={{ padding: "28px 20px 0" }}>
            <AccountPage
              user={user}
              profile={profile}
              onBack={goHome}
              onProfileUpdate={(updates) => {
                setUser(prev => ({ ...prev, ...updates }));
                setProfile(prev => prev ? { ...prev, ...updates } : prev);
              }}
              onSignOut={handleSignOut}
            />
          </main>
          <Footer
            onSpin={() => { setView("home"); setTab("spin"); window.scrollTo(0, 0); }}
            onBrowse={() => { setView("home"); setTab("browse"); window.scrollTo(0, 0); }}
            onShowAuth={() => setShowAuth(true)}
          />
        </>
      )}

      {/* Country Page */}
      {view === "country" && country && (
        <>
          <main style={{ padding: "28px 20px 0" }}>
            <CountryPage country={country} user={user} saved={saved} onSave={handleSave} onRemove={handleRemove} onBack={goHome} />
          </main>
          <Footer
            onSpin={() => { setView("home"); setTab("spin"); window.scrollTo(0, 0); }}
            onBrowse={() => { setView("home"); setTab("browse"); window.scrollTo(0, 0); }}
            onShowAuth={() => setShowAuth(true)}
          />
        </>
      )}

      {/* Home */}
      {view === "home" && (
        <main>
          {/* Hero — always visible */}
          <Hero />

          {/* Tab nav — banana strip below hero */}
          <div style={{ background: "var(--noshd-banana)", position: "relative", paddingTop: "20px" }}>
            <div className="tab-nav" style={{
              padding: "0 24px",
              display: "flex",
              gap: "4px",
              borderBottom: "none",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
            }}>
              {navTab("spin", "spin the wheel")}
              {navTab("browse", "browse by country")}
              {user && navTab("my", `my restaurants${savedCount > 0 ? ` (${savedCount})` : ""}`)}
            </div>
          </div>

          {/* Tab content */}
          {tab === "spin" && (
            <>
              {/* Wheel panel */}
              <div id="wheel-section" style={{ background: "#fff", borderTop: "none" }}>
                <div style={{ padding: "24px 24px 48px" }}>
                  <div style={{ maxWidth: "860px", margin: "0 auto" }}>
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

              {/* Ad — below wheel */}
              <AdBanner size="leaderboard" user={user} />

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
                      style={{ background: "var(--noshd-tangerine)", color: "white", border: "2px solid var(--noshd-tangerine)", borderRadius: "4px", padding: "10px 24px", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
                      see restaurants →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {tab === "browse" && (
            <div style={{ background: "#fff", padding: "28px 24px", animation: "fadeUp 0.3s ease" }}>
              <div style={{ maxWidth: "860px", margin: "0 auto" }}>
                <CountryBrowser savedCountrySet={savedCountrySet} favCountrySet={favCountrySet} onSelectCountry={goCountry}
                  browseView={browseView} setBrowseView={setBrowseView} />
              </div>
            </div>
          )}

          {tab === "my" && user && (
            <div style={{ background: "#fff", padding: "28px 20px 0", animation: "fadeUp 0.3s ease" }}>
              <MyRestaurants user={user} saved={saved} onSave={handleSave} onRemove={handleRemove} onBack={goHome} />
              <AdBanner size="rectangle" user={user} />
            </div>
          )}

          {/* Footer */}
          <Footer
            onSpin={() => { setTab("spin"); window.scrollTo({ top: document.getElementById("wheel-section")?.offsetTop || 0, behavior: "smooth" }); }}
            onBrowse={() => setTab("browse")}
            onShowAuth={() => setShowAuth(true)}
          />
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
