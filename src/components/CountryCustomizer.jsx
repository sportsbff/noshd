"use client";
import { useState } from "react";
import { X, Search, ChevronUp, ChevronDown, Check } from "lucide-react";
import { COUNTRY_DATA, REGIONS } from "@/data/countries";

export default function CountryCustomizer({ selected, onApply, onClose }) {
  const [draft, setDraft] = useState(new Set(selected));
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(new Set(Object.keys(REGIONS)));

  const toggle = (c) => {
    const n = new Set(draft);
    n.has(c) ? (n.size > 3 && n.delete(c)) : (n.size < 22 && n.add(c));
    setDraft(n);
  };
  const match = (c) => !search || c.toLowerCase().includes(search.toLowerCase());

  const toggleRegion = (countries) => {
    const n = new Set(draft);
    const vis = countries.filter(match);
    const allSelected = vis.every(c => n.has(c));
    if (allSelected) {
      vis.forEach(c => n.delete(c));
      if (n.size < 3) return; // don't go below min
    } else {
      vis.forEach(c => { if (n.size < 22) n.add(c); });
    }
    setDraft(n);
  };

  const selectAll = () => {
    const all = Object.values(REGIONS).flat().filter(match);
    const n = new Set(all.slice(0, 22));
    setDraft(n);
  };

  const deselectAll = () => {
    setDraft(new Set());
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "4px", width: "min(460px,95vw)", maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.3)", overflow: "hidden", fontFamily: "var(--font-body)" }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--noshd-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--noshd-charcoal)" }}>customize your wheel</div>
            <div style={{ fontSize: "12px", marginTop: "2px", color: "var(--noshd-muted)" }}>{draft.size} countries &middot; min 3, max 22</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--noshd-muted)" }}><X size={18} /></button>
        </div>

        <div style={{ padding: "8px 20px", borderBottom: "1px solid var(--noshd-border-faint)", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} color="var(--noshd-faint)" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="search countries..."
              style={{ width: "100%", padding: "8px 12px 8px 32px", border: "1.5px solid var(--noshd-border)", borderRadius: "4px", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "var(--font-body)", color: "var(--noshd-charcoal)" }} />
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={selectAll}
              style={{ padding: "4px 10px", border: "1.5px solid var(--noshd-border)", borderRadius: "50px", background: "transparent", color: "var(--noshd-muted)", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
              select all
            </button>
            <button onClick={deselectAll}
              style={{ padding: "4px 10px", border: "1.5px solid var(--noshd-border)", borderRadius: "50px", background: "transparent", color: "var(--noshd-muted)", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
              deselect all
            </button>
          </div>
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: "4px 0" }}>
          {Object.entries(REGIONS).map(([region, countries]) => {
            const vis = countries.filter(match);
            if (!vis.length) return null;
            const isOpen = open.has(region);
            const sel = countries.filter(c => draft.has(c)).length;
            const allRegionSelected = vis.every(c => draft.has(c));
            const emoji = region.split("  ")[0];
            const name = region.split("  ")[1];
            return (
              <div key={region}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button onClick={() => { const n = new Set(open); n.has(region) ? n.delete(region) : n.add(region); setOpen(n); }}
                    style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "8px 20px", display: "flex", alignItems: "center", gap: "8px", textAlign: "left" }}>
                    <span style={{ flex: 1, fontWeight: 700, fontSize: "13px", color: "var(--noshd-charcoal)", fontFamily: "var(--font-body)" }}>
                      {emoji} {name}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--noshd-muted)" }}>{sel}/{countries.length}</span>
                    {isOpen ? <ChevronUp size={14} color="var(--noshd-muted)" /> : <ChevronDown size={14} color="var(--noshd-muted)" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleRegion(countries); }}
                    style={{ padding: "3px 10px", marginRight: "12px", border: `1.5px solid ${allRegionSelected ? "var(--noshd-accent)" : "var(--noshd-border)"}`, borderRadius: "50px", background: allRegionSelected ? "var(--noshd-accent-bg)" : "transparent", color: allRegionSelected ? "var(--noshd-accent)" : "var(--noshd-faint)", fontSize: "10px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {allRegionSelected ? "deselect" : "select all"}
                  </button>
                </div>
                {isOpen && vis.map(c => {
                  const on = draft.has(c);
                  return (
                    <button key={c} onClick={() => toggle(c)} disabled={!on && draft.size >= 22}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: "10px",
                        padding: "8px 20px", border: "none", textAlign: "left",
                        transition: "colors 0.1s",
                        cursor: on || draft.size < 22 ? "pointer" : "not-allowed",
                        background: on ? "var(--noshd-accent-bg)" : "transparent",
                      }}>
                      <span style={{
                        width: "18px", height: "18px", borderRadius: "3px", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: on ? "none" : "1.5px solid var(--noshd-border)",
                        background: on ? "#FF5500" : "transparent",
                      }}>
                        {on && <Check size={11} color="white" strokeWidth={3} />}
                      </span>
                      <span style={{ fontSize: "15px" }}>{COUNTRY_DATA[c]?.flag}</span>
                      <span style={{
                        fontSize: "14px", flex: 1,
                        color: on ? "#FF5500" : "var(--noshd-charcoal)",
                        fontWeight: on ? 600 : 400,
                        fontFamily: "var(--font-body)",
                      }}>{c}</span>
                      <span style={{ fontSize: "11px", color: "var(--noshd-faint)" }}>{COUNTRY_DATA[c]?.restaurants?.length}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--noshd-border)", display: "flex", gap: "8px" }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: "10px", border: "1.5px solid var(--noshd-border)", borderRadius: "4px", background: "none", fontSize: "13px", cursor: "pointer", fontWeight: 600, color: "var(--noshd-muted)", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
            cancel
          </button>
          <button onClick={() => onApply([...draft])}
            style={{ flex: 2, padding: "10px", background: "var(--noshd-charcoal)", color: "white", border: "2px solid var(--noshd-charcoal)", borderRadius: "4px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
            apply ({draft.size})
          </button>
        </div>
      </div>
    </div>
  );
}
