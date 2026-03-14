"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, List, MapPin } from "lucide-react";
import { ALL_COUNTRIES, COUNTRY_DATA, REGIONS, HOOD_COORDS } from "@/data/countries";

const REGION_COLORS = ["#FF5500", "#1010FF", "#FFB000", "#A4DDFF", "#1010FF", "#FF5500"];

function BrowseByRegion({ goCountry, savedCountrySet, favCountrySet }) {
  const [openRegions, setOpenRegions] = useState(new Set());
  const toggle = (r) => { const n = new Set(openRegions); n.has(r) ? n.delete(r) : n.add(r); setOpenRegions(n); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {Object.entries(REGIONS).map(([region, countries], ri) => {
        const sorted = [...countries].sort((a, b) => a.localeCompare(b));
        const color = REGION_COLORS[ri % REGION_COLORS.length];
        const isOpen = openRegions.has(region);
        const emoji = region.split("  ")[0];
        const name = region.split("  ")[1];
        return (
          <div key={region} style={{ border: `1px solid ${isOpen ? color : "var(--noshd-border)"}`, borderRadius: "4px", overflow: "hidden", transition: "border-color 0.15s" }}>
            <button onClick={() => toggle(region)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", background: isOpen ? "#fff" : "var(--noshd-cream)", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.1s" }}>
              <div style={{ width: "4px", height: "28px", borderRadius: "2px", background: color, flexShrink: 0 }} />
              <span style={{ fontSize: "20px" }}>{emoji}</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 400, color: "var(--noshd-charcoal)", flex: 1 }}>{name}</span>
              <span style={{ fontSize: "12px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)", marginRight: "8px" }}>{countries.length} {countries.length === 1 ? "country" : "countries"}</span>
              {isOpen ? <ChevronUp size={16} color="var(--noshd-muted)" /> : <ChevronDown size={16} color="var(--noshd-muted)" />}
            </button>
            {isOpen && (
              <div style={{ padding: "4px 18px 18px", background: "#fff", animation: "fadeUp 0.2s ease" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: "10px" }}>
                  {sorted.map(c => {
                    const d = COUNTRY_DATA[c]; if (!d) return null;
                    const isSaved = savedCountrySet?.has(c); const isFav = favCountrySet?.has(c);
                    return (
                      <button key={c} onClick={() => goCountry(c)} style={{ background: "var(--noshd-white)", border: "1px solid var(--noshd-border)", borderRadius: "4px", padding: 0, cursor: "pointer", textAlign: "center", transition: "all 0.15s", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden", position: "relative" }}>
                        <div style={{ width: "100%", height: "3px", background: color }} />
                        <div style={{ padding: "12px 10px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                          {(isFav || isSaved) && <div style={{ position: "absolute", top: "10px", right: "8px", fontSize: "10px" }}>{isFav ? "⭐" : "🔴"}</div>}
                          <span style={{ fontSize: "22px" }}>{d.flag}</span>
                          <span style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "13px", color: "var(--noshd-charcoal)", lineHeight: 1.2 }}>{c}</span>
                          <span style={{ fontSize: "11px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)" }}>{d.restaurants.length} spot{d.restaurants.length > 1 ? "s" : ""}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function BrowseChicagoMap({ goCountry }) {
  const [selectedHood, setSelectedHood] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const byHood = {};
  ALL_COUNTRIES.forEach(c => {
    const data = COUNTRY_DATA[c]; if (!data) return;
    data.restaurants.forEach(r => {
      if (!byHood[r.neighborhood]) byHood[r.neighborhood] = [];
      byHood[r.neighborhood].push({ ...r, country: c, flag: data.flag });
    });
  });

  const pinColor = (count) => count >= 4 ? "#FF5500" : count >= 2 ? "#1010FF" : "#57534E";

  useEffect(() => {
    let cancelled = false;

    function initMap() {
      if (cancelled || !mapRef.current) return;
      if (mapInstanceRef.current) return;

      const map = window.L.map(mapRef.current, {
        center: [41.88, -87.65],
        zoom: 11,
        scrollWheelZoom: true,
      });

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      Object.entries(byHood).forEach(([hood, items]) => {
        const coords = HOOD_COORDS[hood];
        if (!coords) return;
        const cuisineCount = new Set(items.map(i => i.country)).size;
        const color = pinColor(cuisineCount);
        const size = 28;

        const icon = window.L.divIcon({
          className: "",
          html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;font-family:var(--font-body);box-shadow:0 2px 6px rgba(0,0,0,0.25);cursor:pointer;">${items.length}</div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = window.L.marker([coords[0], coords[1]], { icon })
          .addTo(map)
          .bindTooltip(hood, {
            direction: "top",
            offset: [0, -16],
            className: "leaflet-hood-tooltip",
          });

        marker.on("click", () => {
          setSelectedHood(prev => prev === hood ? null : hood);
        });

        markersRef.current.push(marker);
      });

      mapInstanceRef.current = map;
    }

    if (window.L) {
      initMap();
    } else {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => initMap();
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, []);

  return (
    <div style={{ background: "#fff", borderRadius: "4px", border: "1px solid var(--noshd-border)", padding: "20px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--noshd-muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", fontFamily: "var(--font-body)" }}>
        📍 all restaurants across chicago — click a neighborhood
      </div>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "420px", borderRadius: "4px", border: "1px solid var(--noshd-border)" }}
      />
      {selectedHood && byHood[selectedHood] && (
        <div style={{ marginTop: "16px", animation: "fadeUp 0.2s ease" }}>
          <div style={{ fontSize: "15px", fontWeight: 400, color: "var(--noshd-charcoal)", fontFamily: "var(--font-display)", marginBottom: "4px" }}>{selectedHood}</div>
          <div style={{ fontSize: "12px", color: "var(--noshd-muted)", fontFamily: "var(--font-body)", marginBottom: "12px" }}>
            {byHood[selectedHood].length} restaurant{byHood[selectedHood].length > 1 ? "s" : ""} &middot; {new Set(byHood[selectedHood].map(i => i.country)).size} cuisine{new Set(byHood[selectedHood].map(i => i.country)).size > 1 ? "s" : ""}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {byHood[selectedHood].map((r, i) => (
              <button key={i} onClick={() => goCountry(r.country)} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "10px 12px", background: "var(--noshd-cream)", border: "1px solid var(--noshd-border)", borderRadius: "4px", fontSize: "13px", cursor: "pointer", textAlign: "left", width: "100%" }}>
                <span style={{ fontSize: "18px" }}>{r.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", color: "var(--noshd-charcoal)" }}>{r.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--noshd-muted)", fontFamily: "var(--font-body)" }}>{r.country} &middot; {r.price}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      <div style={{ fontSize: "11px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)", textAlign: "center", marginTop: "12px" }}>pin color = cuisine count · click to explore</div>
    </div>
  );
}

export default function CountryBrowser({ savedCountrySet, favCountrySet, onSelectCountry, browseView, setBrowseView }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "26px", color: "var(--noshd-charcoal)", marginBottom: "4px" }}>browse by country</h2>
          <p style={{ color: "var(--noshd-muted)", fontSize: "14px", fontFamily: "var(--font-body)" }}>{ALL_COUNTRIES.length} cuisines &middot; chicago</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--noshd-cream)", borderRadius: "4px", padding: "3px", border: "1px solid var(--noshd-border)" }}>
          <button onClick={() => setBrowseView("grid")} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-body)", background: browseView === "grid" ? "var(--noshd-charcoal)" : "transparent", color: browseView === "grid" ? "white" : "var(--noshd-muted)", textTransform: "lowercase" }}><List size={13} />by region</button>
          <button onClick={() => setBrowseView("map")} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-body)", background: browseView === "map" ? "var(--noshd-charcoal)" : "transparent", color: browseView === "map" ? "white" : "var(--noshd-muted)", textTransform: "lowercase" }}><MapPin size={13} />map</button>
        </div>
      </div>
      {browseView === "grid" && <BrowseByRegion goCountry={onSelectCountry} savedCountrySet={savedCountrySet} favCountrySet={favCountrySet} />}
      {browseView === "map" && <BrowseChicagoMap goCountry={onSelectCountry} />}
    </>
  );
}
