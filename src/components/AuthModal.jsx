"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { signIn, signUp, supabase } from "@/lib/supabase";

export default function AuthModal({ onAuth, onClose }) {
  const [tab, setTab] = useState("signin");
  const [tier, setTier] = useState("free");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!email || !password) { setError("Please enter email and password"); return; }

    // If Supabase is not configured, use demo mode
    if (!supabase) {
      onAuth({ name: name || email.split("@")[0], tier, email });
      return;
    }

    setLoading(true);
    if (tab === "signup") {
      const { data, error: err } = await signUp(email, password, name || email.split("@")[0], tier);
      if (err) { setError(err.message); setLoading(false); return; }
      const user = data?.user;
      if (user) {
        onAuth({ name: name || email.split("@")[0], tier, email, id: user.id });
      }
    } else {
      const { data, error: err } = await signIn(email, password);
      if (err) { setError(err.message); setLoading(false); return; }
      const user = data?.user;
      if (user) {
        const displayName = user.user_metadata?.name || email.split("@")[0];
        const displayTier = user.user_metadata?.tier || "free";
        onAuth({ name: displayName, tier: displayTier, email: user.email, id: user.id });
      }
    }
    setLoading(false);
  };

  const demo = (t) => onAuth({ name: t === "premium" ? "Alex (Premium)" : "Alex", tier: t });

  const inp = {
    width: "100%", padding: "10px 12px", border: "1.5px solid var(--noshd-border)",
    borderRadius: "4px", fontSize: "14px", outline: "none", boxSizing: "border-box",
    fontFamily: "var(--font-body)", background: "#fff", color: "var(--noshd-charcoal)",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "4px", width: "min(440px,95vw)", boxShadow: "0 24px 64px rgba(0,0,0,0.3)", overflow: "hidden", fontFamily: "var(--font-body)" }}>
        <div style={{ padding: "22px 26px 0", borderBottom: "1px solid var(--noshd-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "22px", color: "var(--noshd-charcoal)" }}>noshd</div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--noshd-muted)" }}><X size={18} /></button>
          </div>
          <div style={{ display: "flex", gap: 0, marginBottom: "-1px" }}>
            {["signin", "signup"].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(null); }}
                style={{
                  flex: 1, padding: "10px 0", border: "none", background: "none", cursor: "pointer",
                  fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-body)",
                  color: tab === t ? "var(--noshd-charcoal)" : "var(--noshd-muted)",
                  borderBottom: `2px solid ${tab === t ? "#FF5500" : "transparent"}`,
                  textTransform: "lowercase",
                }}>
                {t === "signin" ? "sign in" : "create account"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "22px 26px" }}>
          {tab === "signup" && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "6px" }}>
                {[["free", "free", "includes ads"], ["premium", "premium · $5/mo", "no ads"]].map(([v, title, sub]) => (
                  <button key={v} onClick={() => setTier(v)}
                    style={{
                      padding: "12px", border: `2px solid ${tier === v ? "#FF5500" : "var(--noshd-border)"}`,
                      borderRadius: "4px", background: tier === v ? "var(--noshd-accent-bg)" : "#fff",
                      cursor: "pointer", textAlign: "left",
                    }}>
                    <div style={{ fontWeight: 700, fontSize: "13px", color: tier === v ? "#FF5500" : "var(--noshd-charcoal)", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>{title}</div>
                    <div style={{ fontSize: "11px", color: "var(--noshd-muted)", marginTop: "2px", fontFamily: "var(--font-body)" }}>{sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{ padding: "8px 12px", borderRadius: "4px", marginBottom: "10px", fontSize: "13px", fontFamily: "var(--font-body)", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
            {tab === "signup" && <input placeholder="your name" value={name} onChange={e => setName(e.target.value)} style={inp} />}
            <input placeholder="email address" value={email} onChange={e => setEmail(e.target.value)} type="email" style={inp} />
            <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={inp}
              onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }} />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", padding: "12px", background: loading ? "var(--noshd-border)" : "var(--noshd-charcoal)", color: loading ? "var(--noshd-muted)" : "white", border: `2px solid ${loading ? "var(--noshd-border)" : "var(--noshd-charcoal)"}`, borderRadius: "4px", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
            {loading ? "loading..." : tab === "signin" ? "sign in" : "create account"}
          </button>

          {!supabase && (
            <div style={{ textAlign: "center", margin: "10px 0 0", fontSize: "11px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)" }}>
              demo mode — supabase not configured
            </div>
          )}

          <div style={{ textAlign: "center", margin: "14px 0 4px", color: "var(--noshd-faint)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-body)" }}>or try a demo</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <button onClick={() => demo("free")}
              style={{ padding: "9px", border: "1.5px solid var(--noshd-border)", borderRadius: "4px", background: "#fff", fontSize: "12px", cursor: "pointer", color: "var(--noshd-muted)", fontWeight: 600, fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
              free demo
            </button>
            <button onClick={() => demo("premium")}
              style={{ padding: "9px", border: "1.5px solid #FFF597", borderRadius: "4px", background: "#FFFBF0", fontSize: "12px", cursor: "pointer", color: "#7A5A00", fontWeight: 600, fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
              premium demo
            </button>
          </div>

          <p style={{ fontSize: "11px", textAlign: "center", marginTop: "14px", lineHeight: 1.6, color: "var(--noshd-faint)", fontFamily: "var(--font-body)" }}>
            no account needed to browse. create one to save restaurants and track where you&apos;ve noshd.
          </p>
        </div>
      </div>
    </div>
  );
}
