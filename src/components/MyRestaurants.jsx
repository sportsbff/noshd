"use client";
import { useState } from "react";
import { ChevronLeft, ChevronDown, ChevronUp, List, MapPin, Star, X } from "lucide-react";
import { COUNTRY_DATA, HOOD_COORDS } from "@/data/countries";
import { restKey } from "@/lib/utils";

export default function MyRestaurants({ user, saved, onSave, onRemove, onBack }) {
  const [view, setView] = useState("list");
  const [expandedKey, setExpandedKey] = useState(null);

  const entries = Object.entries(saved).map(([key, data]) => {
    const [c, ...rest] = key.split("||");
    const rName = rest.join("||");
    const countryData = COUNTRY_DATA[c];
    const restaurant = countryData?.restaurants.find(r => r.name === rName);
    return restaurant ? { key, country: c, restaurant, ...data } : null;
  }).filter(Boolean);

  const favs = entries.filter(e => e.status === "favorite");
  const visited = entries.filter(e => e.status === "visited");
  const wantToGo = entries.filter(e => e.status === "want");

  if (!entries.length) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📍</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "26px", color: "var(--noshd-charcoal)", marginBottom: "8px" }}>no saved restaurants yet</h2>
        <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--noshd-muted)", fontFamily: "var(--font-body)", marginBottom: "20px" }}>
          as you explore, mark restaurants as visited or favorite. they&apos;ll appear here with your ratings and notes.
        </p>
        <button onClick={onBack}
          style={{ padding: "10px 24px", background: "var(--noshd-charcoal)", color: "white", border: "2px solid var(--noshd-charcoal)", borderRadius: "4px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
          start exploring
        </button>
      </div>
    );
  }

  // SVG map helpers
  const minLat = 41.72, maxLat = 42.05, minLng = -87.85, maxLng = -87.55;
  const projectChicago = (lat, lng) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 580 + 60;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 500 + 30;
    return [x, y];
  };

  // Group saved entries by neighborhood for map
  const byHood = {};
  entries.forEach(e => {
    const hood = e.restaurant.neighborhood;
    if (!byHood[hood]) byHood[hood] = [];
    byHood[hood].push(e);
  });

  const [selectedHood, setSelectedHood] = useState(null);

  const renderEntry = (e) => {
    const isExpanded = expandedKey === e.key;
    return (
      <div key={e.key} style={{ background: "#fff", border: "1px solid var(--noshd-border)", borderRadius: "4px", overflow: "hidden" }}>
        <button onClick={() => setExpandedKey(isExpanded ? null : e.key)}
          style={{ width: "100%", display: "flex", gap: "10px", alignItems: "center", padding: "12px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
          <span style={{ fontSize: "22px" }}>{COUNTRY_DATA[e.country]?.flag}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "15px", color: "var(--noshd-charcoal)" }}>{e.restaurant.name}</div>
            <div style={{ fontSize: "11px", color: "var(--noshd-muted)", fontFamily: "var(--font-body)", marginTop: "1px" }}>{e.country} &middot; {e.restaurant.neighborhood}</div>
          </div>
          {e.rating > 0 && (
            <div style={{ display: "flex", gap: "2px" }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={11} color={s <= e.rating ? "#F59E0B" : "#DDD"} fill={s <= e.rating ? "#F59E0B" : "none"} />)}
            </div>
          )}
          {isExpanded ? <ChevronUp size={14} color="var(--noshd-muted)" /> : <ChevronDown size={14} color="var(--noshd-muted)" />}
        </button>
        {isExpanded && (
          <div style={{ padding: "0 14px 14px", borderTop: "1px solid var(--noshd-border-faint)" }}>
            <p style={{ fontSize: "13px", color: "var(--noshd-muted)", lineHeight: 1.7, fontFamily: "var(--font-body)", margin: "10px 0" }}>{e.restaurant.description}</p>
            {e.restaurant.mustTry && (
              <div style={{ borderLeft: "3px solid #FF5500", paddingLeft: "12px", marginBottom: "10px" }}>
                <div style={{ fontSize: "10px", color: "var(--noshd-faint)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px", fontFamily: "var(--font-body)" }}>recommended</div>
                <div style={{ fontSize: "13px", color: "var(--noshd-charcoal)", fontFamily: "var(--font-body)", fontWeight: 600 }}>{e.restaurant.mustTry}</div>
              </div>
            )}
            {e.note && <div style={{ fontSize: "12px", fontStyle: "italic", color: "var(--noshd-muted)", fontFamily: "var(--font-body)", marginBottom: "8px" }}>&ldquo;{e.note}&rdquo;</div>}
            <button onClick={() => onRemove(e.key)}
              style={{ padding: "5px 12px", border: "1.5px solid var(--noshd-border)", borderRadius: "4px", background: "none", fontSize: "12px", cursor: "pointer", color: "var(--noshd-muted)", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
              remove
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderSection = (list, label, emoji) => {
    if (!list.length) return null;
    return (
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", paddingBottom: "8px", borderBottom: "1px solid var(--noshd-border)", color: "var(--noshd-muted)", fontFamily: "var(--font-body)" }}>
          {emoji} {label} — {list.length}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {list.map(renderEntry)}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 20px 60px", animation: "fadeUp 0.3s ease" }}>
      <button onClick={onBack}
        style={{ background: "none", border: "1.5px solid var(--noshd-border)", borderRadius: "50px", color: "var(--noshd-muted)", padding: "6px 14px", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px", marginBottom: "20px", fontWeight: 600, fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
        <ChevronLeft size={13} /> back
      </button>

      <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 400, color: "var(--noshd-charcoal)" }}>my restaurants</h1>
        <span style={{ fontSize: "13px", color: "var(--noshd-muted)", fontFamily: "var(--font-body)" }}>{entries.length} saved</span>
      </div>

      {/* List / Map toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--noshd-cream)", borderRadius: "4px", padding: "3px", width: "fit-content", marginBottom: "20px", border: "1px solid var(--noshd-border)" }}>
        <button onClick={() => setView("list")} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-body)", background: view === "list" ? "var(--noshd-charcoal)" : "transparent", color: view === "list" ? "white" : "var(--noshd-muted)", textTransform: "lowercase" }}><List size={13} />list</button>
        <button onClick={() => setView("map")} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-body)", background: view === "map" ? "var(--noshd-charcoal)" : "transparent", color: view === "map" ? "white" : "var(--noshd-muted)", textTransform: "lowercase" }}><MapPin size={13} />map</button>
      </div>

      {view === "list" && (
        <>
          {renderSection(favs, "favorites", "⭐")}
          {renderSection(wantToGo, "want to go", "🔵")}
          {renderSection(visited, "visited", "🔴")}
        </>
      )}

      {view === "map" && (
        <div style={{ background: "#fff", borderRadius: "4px", border: "1px solid var(--noshd-border)", padding: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--noshd-muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", fontFamily: "var(--font-body)" }}>📍 my saved restaurants in chicago</div>
          <svg viewBox="0 0 700 560" style={{ width: "100%", height: "auto", display: "block" }}>
            <rect x="40" y="20" width="620" height="520" rx="8" fill="#F5F5F4" stroke="var(--noshd-border)" strokeWidth="1" />
            <path d="M580 20 L660 20 L660 340 Q660 380 620 400 Q580 420 560 520 L560 520" fill="#D4E4EE" stroke="#B8CDD9" strokeWidth="1" />
            {[0,1,2,3,4].map(i => <line key={`h${i}`} x1="40" y1={20 + i * 130} x2="660" y2={20 + i * 130} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />)}
            {[0,1,2,3,4].map(i => <line key={`v${i}`} x1={40 + i * 155} y1="20" x2={40 + i * 155} y2="540" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />)}
            <text x="620" y="360" fill="#B8CDD9" fontSize="11" fontFamily="var(--font-body)" transform="rotate(-90 620 360)">lake michigan</text>
            {Object.entries(byHood).map(([hood, items]) => {
              const coords = HOOD_COORDS[hood]; if (!coords) return null;
              const [x, y] = projectChicago(coords[0], coords[1]);
              const isSelected = selectedHood === hood;
              const hasFav = items.some(e => e.status === "favorite");
              return (
                <g key={hood} onClick={() => setSelectedHood(isSelected ? null : hood)} style={{ cursor: "pointer" }}>
                  <ellipse cx={x} cy={y + 12} rx="5" ry="2" fill="rgba(0,0,0,0.08)" />
                  <circle cx={x} cy={y} r={isSelected ? 14 : 10} fill={hasFav ? "#F59E0B" : "#FF5500"} stroke="#fff" strokeWidth="2" style={{ transition: "r 0.15s" }} />
                  <text x={x} y={y + 4} textAnchor="middle" fontSize={isSelected ? "13" : "11"} fill="#fff" fontWeight="700" fontFamily="var(--font-body)">{items.length}</text>
                  <text x={x} y={y - 16} textAnchor="middle" fontSize="9" fill="var(--noshd-muted)" fontFamily="var(--font-body)" style={{ textTransform: "lowercase" }}>{hood}</text>
                </g>
              );
            })}
          </svg>
          {selectedHood && byHood[selectedHood] && (
            <div style={{ marginTop: "16px", animation: "fadeUp 0.2s ease" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--noshd-charcoal)", fontFamily: "var(--font-display)", marginBottom: "10px" }}>{selectedHood} — {byHood[selectedHood].length} saved</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {byHood[selectedHood].map(e => renderEntry(e))}
              </div>
            </div>
          )}
          <div style={{ fontSize: "11px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)", textAlign: "center", marginTop: "12px" }}>click a pin to see restaurants</div>
        </div>
      )}
    </div>
  );
}
