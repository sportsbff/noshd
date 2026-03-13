"use client";
import { useState } from "react";
import { ChevronLeft, List, MapPin } from "lucide-react";
import { COUNTRY_DATA, HOOD_COORDS } from "@/data/countries";
import RestaurantCard from "./RestaurantCard";

export default function CountryPage({ country, user, saved, onSave, onRemove, onBack }) {
  const data = COUNTRY_DATA[country];
  const [cpView, setCpView] = useState("list");
  const [selectedHood, setSelectedHood] = useState(null);

  if (!data) return null;

  // Group restaurants by neighborhood for SVG map
  const byHood = {};
  data.restaurants.forEach(r => {
    if (!byHood[r.neighborhood]) byHood[r.neighborhood] = [];
    byHood[r.neighborhood].push(r);
  });
  const minLat = 41.72, maxLat = 42.05, minLng = -87.85, maxLng = -87.55;
  const projectChicago = (lat, lng) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 580 + 60;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 500 + 30;
    return [x, y];
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 20px 60px", animation: "fadeUp 0.3s ease" }}>
      <button onClick={onBack}
        style={{ background: "none", border: "1.5px solid var(--noshd-border)", borderRadius: "50px", color: "var(--noshd-muted)", padding: "6px 14px", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px", marginBottom: "20px", fontWeight: 600, fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
        <ChevronLeft size={13} /> all countries
      </button>

      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--noshd-border)" }}>
        <span style={{ fontSize: "48px", lineHeight: 1, flexShrink: 0 }}>{data.flag}</span>
        <div>
          <h1 style={{ margin: "0 0 6px", fontSize: "28px", fontWeight: 400, fontFamily: "var(--font-display)", color: "var(--noshd-charcoal)" }}>{country}</h1>
          <p style={{ color: "var(--noshd-muted)", fontSize: "14px", lineHeight: 1.7, margin: "0 0 10px", fontFamily: "var(--font-body)" }}>{data.description}</p>
          <span style={{ fontSize: "12px", color: "var(--noshd-faint)", fontWeight: 600, fontFamily: "var(--font-body)" }}>{data.restaurants.length} authentic spot{data.restaurants.length > 1 ? "s" : ""} in chicago</span>
        </div>
      </div>

      {/* List / Map toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--noshd-cream)", borderRadius: "4px", padding: "3px", width: "fit-content", marginBottom: "20px", border: "1px solid var(--noshd-border)" }}>
        <button onClick={() => setCpView("list")} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-body)", background: cpView === "list" ? "var(--noshd-charcoal)" : "transparent", color: cpView === "list" ? "white" : "var(--noshd-muted)", textTransform: "lowercase" }}><List size={13} />list</button>
        <button onClick={() => setCpView("map")} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-body)", background: cpView === "map" ? "var(--noshd-charcoal)" : "transparent", color: cpView === "map" ? "white" : "var(--noshd-muted)", textTransform: "lowercase" }}><MapPin size={13} />map</button>
      </div>

      {cpView === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {data.restaurants.map((r, i) => <RestaurantCard key={i} country={country} restaurant={r} user={user} saved={saved} onSave={onSave} onRemove={onRemove} />)}
        </div>
      )}

      {cpView === "map" && (
        <div style={{ background: "#fff", borderRadius: "4px", border: "1px solid var(--noshd-border)", padding: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--noshd-muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", fontFamily: "var(--font-body)" }}>📍 {country.toLowerCase()} restaurants in chicago</div>
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
              return (
                <g key={hood} onClick={() => setSelectedHood(isSelected ? null : hood)} style={{ cursor: "pointer" }}>
                  <ellipse cx={x} cy={y + 12} rx="5" ry="2" fill="rgba(0,0,0,0.08)" />
                  <circle cx={x} cy={y} r={isSelected ? 14 : 10} fill="#FF5500" stroke="#fff" strokeWidth="2" style={{ transition: "r 0.15s" }} />
                  <text x={x} y={y + 4} textAnchor="middle" fontSize={isSelected ? "13" : "11"} fill="#fff" fontWeight="700" fontFamily="var(--font-body)">{items.length}</text>
                  <text x={x} y={y - 16} textAnchor="middle" fontSize="9" fill="var(--noshd-muted)" fontFamily="var(--font-body)" style={{ textTransform: "lowercase" }}>{hood}</text>
                </g>
              );
            })}
          </svg>
          {selectedHood && byHood[selectedHood] && (
            <div style={{ marginTop: "16px", animation: "fadeUp 0.2s ease" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--noshd-charcoal)", fontFamily: "var(--font-display)", marginBottom: "10px" }}>{selectedHood} — {byHood[selectedHood].length} spot{byHood[selectedHood].length > 1 ? "s" : ""}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {byHood[selectedHood].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "12px 14px", background: "var(--noshd-cream)", border: "1px solid var(--noshd-border)", borderRadius: "4px", fontSize: "13px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-display)", color: "var(--noshd-charcoal)", fontSize: "15px" }}>{r.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--noshd-muted)", fontFamily: "var(--font-body)", marginTop: "2px" }}>{r.neighborhood} &middot; {r.price}</div>
                      {r.mustTry && <div style={{ fontSize: "11px", color: "#FF5500", fontFamily: "var(--font-body)", marginTop: "3px" }}>try: {r.mustTry}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ fontSize: "11px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)", textAlign: "center", marginTop: "12px" }}>click a pin to see restaurants</div>
        </div>
      )}
    </div>
  );
}
