"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, List, MapPin, X } from "lucide-react";
import { ALL_COUNTRIES, COUNTRY_DATA, REGIONS, HOOD_COORDS, COORDS } from "@/data/countries";

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

function loadLeaflet() {
  return new Promise((resolve) => {
    if (window.L) { resolve(window.L); return; }
    const cssId = "leaflet-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve(window.L);
    document.body.appendChild(script);
  });
}

function loadMarkerCluster() {
  return new Promise((resolve) => {
    if (window.L?.MarkerClusterGroup) { resolve(); return; }
    const css1 = document.createElement("link");
    css1.rel = "stylesheet";
    css1.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css";
    document.head.appendChild(css1);
    const css2 = document.createElement("link");
    css2.rel = "stylesheet";
    css2.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css";
    document.head.appendChild(css2);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js";
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

function BrowseChicagoMap({ goCountry }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [countryFilter, setCountryFilter] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Build flat list of all restaurants with coords
  const allRestaurants = [];
  ALL_COUNTRIES.forEach(c => {
    const data = COUNTRY_DATA[c]; if (!data) return;
    data.restaurants.forEach(r => {
      const coords = COORDS?.[r.neighborhood] || HOOD_COORDS[r.neighborhood];
      if (coords) {
        allRestaurants.push({ ...r, country: c, flag: data.flag, coords });
      }
    });
  });

  // Get unique countries that have restaurants with coords
  const availableCountries = [...new Set(allRestaurants.map(r => r.country))].sort();

  // Filter restaurants
  const filteredRestaurants = countryFilter.length > 0
    ? allRestaurants.filter(r => countryFilter.includes(r.country))
    : allRestaurants;

  useEffect(() => {
    let cancelled = false;

    loadLeaflet().then(async (L) => {
      await loadMarkerCluster();
      if (cancelled || !mapRef.current) return;
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }

      const map = L.map(mapRef.current, {
        center: [41.88, -87.65],
        zoom: 11,
        scrollWheelZoom: true,
      });
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const clusterGroup = L.markerClusterGroup({
        maxClusterRadius: 45,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          const size = count > 20 ? 40 : count > 5 ? 34 : 28;
          return L.divIcon({
            html: `<div style="background:#FF5500;color:white;border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;font-size:${count > 20 ? 14 : 12}px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white;">${count}</div>`,
            className: "",
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });
        },
      });

      filteredRestaurants.forEach((r) => {
        const jLat = (Math.random() - 0.5) * 0.003;
        const jLng = (Math.random() - 0.5) * 0.003;

        const icon = L.divIcon({
          html: `<span style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.3));cursor:pointer;">📍</span>`,
          className: "",
          iconSize: [24, 24],
          iconAnchor: [12, 22],
        });

        const marker = L.marker([r.coords[0] + jLat, r.coords[1] + jLng], { icon });
        marker.bindTooltip(`${r.flag} ${r.name}`, { direction: "top", offset: [0, -12] });
        marker.on("click", () => setSelectedRestaurant(r));
        clusterGroup.addLayer(marker);
      });

      map.addLayer(clusterGroup);
      setTimeout(() => map.invalidateSize(), 100);
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [countryFilter]);

  return (
    <div style={{ background: "#fff", borderRadius: "4px", border: "1px solid var(--noshd-border)", padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--noshd-muted)", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "var(--font-body)" }}>
          📍 {filteredRestaurants.length} restaurants{countryFilter.length > 0 ? ` · ${countryFilter.length} ${countryFilter.length === 1 ? "country" : "countries"}` : ""} — zoom in to explore
        </div>
        <button onClick={() => setShowFilter(!showFilter)}
          style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", border: `1.5px solid ${showFilter ? "var(--noshd-electra)" : "var(--noshd-border)"}`, borderRadius: "4px", background: showFilter ? "rgba(16,16,255,0.06)" : "transparent", color: showFilter ? "var(--noshd-electra)" : "var(--noshd-muted)", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
          <MapPin size={12} /> filter by country
        </button>
      </div>
      {showFilter && (
        <div style={{ marginBottom: "12px", padding: "12px", background: "var(--noshd-cream)", borderRadius: "4px", border: "1px solid var(--noshd-border)", animation: "fadeUp 0.2s ease", maxHeight: "280px", overflowY: "auto" }}>
          {/* Global controls */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
            <button onClick={() => setCountryFilter([])}
              style={{ padding: "4px 12px", border: `1.5px solid ${countryFilter.length === 0 ? "var(--noshd-accent)" : "var(--noshd-border)"}`, borderRadius: "50px", background: countryFilter.length === 0 ? "var(--noshd-accent-bg)" : "#fff", color: countryFilter.length === 0 ? "var(--noshd-accent)" : "var(--noshd-muted)", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
              show all
            </button>
            <button onClick={() => setCountryFilter([...availableCountries])}
              style={{ padding: "4px 12px", border: `1.5px solid ${countryFilter.length === availableCountries.length ? "var(--noshd-accent)" : "var(--noshd-border)"}`, borderRadius: "50px", background: countryFilter.length === availableCountries.length ? "var(--noshd-accent-bg)" : "#fff", color: countryFilter.length === availableCountries.length ? "var(--noshd-accent)" : "var(--noshd-muted)", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
              select all
            </button>
            {countryFilter.length > 0 && (
              <button onClick={() => setCountryFilter([])}
                style={{ padding: "4px 12px", border: "1.5px solid var(--noshd-border)", borderRadius: "50px", background: "#fff", color: "var(--noshd-muted)", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
                clear ({countryFilter.length})
              </button>
            )}
          </div>
          {/* Continent sections */}
          {Object.entries(REGIONS).map(([region, countries]) => {
            const regionCountries = countries.filter(c => availableCountries.includes(c));
            if (regionCountries.length === 0) return null;
            const emoji = region.split("  ")[0];
            const name = region.split("  ")[1];
            const allRegionSelected = regionCountries.every(c => countryFilter.includes(c));
            const someSelected = regionCountries.some(c => countryFilter.includes(c));
            const toggleRegion = () => {
              if (allRegionSelected) {
                setCountryFilter(prev => prev.filter(c => !regionCountries.includes(c)));
              } else {
                setCountryFilter(prev => [...new Set([...prev, ...regionCountries])]);
              }
            };
            return (
              <div key={region} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--noshd-charcoal)", fontFamily: "var(--font-body)" }}>{emoji} {name}</span>
                  <button onClick={toggleRegion}
                    style={{ padding: "2px 8px", border: `1.5px solid ${allRegionSelected ? "var(--noshd-accent)" : someSelected ? "var(--noshd-accent)" : "var(--noshd-border)"}`, borderRadius: "50px", background: allRegionSelected ? "var(--noshd-accent-bg)" : "transparent", color: allRegionSelected ? "var(--noshd-accent)" : "var(--noshd-faint)", fontSize: "10px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
                    {allRegionSelected ? "deselect" : "select all"}
                  </button>
                </div>
                <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                  {regionCountries.map(c => {
                    const active = countryFilter.includes(c);
                    return (
                      <button key={c} onClick={() => setCountryFilter(prev => active ? prev.filter(x => x !== c) : [...prev, c])}
                        style={{ padding: "3px 9px", border: `1.5px solid ${active ? "var(--noshd-accent)" : "var(--noshd-border)"}`, borderRadius: "50px", background: active ? "var(--noshd-accent-bg)" : "#fff", color: active ? "var(--noshd-accent)" : "var(--noshd-muted)", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                        {COUNTRY_DATA[c]?.flag} {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div
        ref={mapRef}
        style={{ width: "100%", height: "420px", borderRadius: "4px", border: "1px solid var(--noshd-border)", position: "relative", zIndex: 1 }}
      />
      <div style={{ fontSize: "11px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)", textAlign: "center", marginTop: "12px" }}>
        {allRestaurants.length} restaurants &middot; zoom in to unfurl clusters &middot; tap a pin for details
      </div>

      {/* Popup overlay for selected restaurant */}
      {selectedRestaurant && (
        <div style={{ position: "fixed", inset: 0, zIndex: 250, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", animation: "fadeUp 0.2s ease" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedRestaurant(null); }}>
          <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", border: "1px solid var(--noshd-border)", width: "min(400px, 92vw)", margin: "20px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "24px" }}>{selectedRestaurant.flag}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--noshd-charcoal)" }}>{selectedRestaurant.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--noshd-muted)", fontFamily: "var(--font-body)" }}>
                      {selectedRestaurant.country} &middot; {selectedRestaurant.neighborhood} &middot; {selectedRestaurant.price}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: "13px", color: "var(--noshd-muted)", lineHeight: 1.6, fontFamily: "var(--font-body)", margin: "8px 0" }}>{selectedRestaurant.description}</p>
                {selectedRestaurant.mustTry && (
                  <div style={{ borderLeft: "3px solid #FF5500", paddingLeft: "10px", marginBottom: "8px" }}>
                    <div style={{ fontSize: "10px", color: "var(--noshd-faint)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1px", fontFamily: "var(--font-body)" }}>recommended</div>
                    <div style={{ fontSize: "13px", color: "var(--noshd-charcoal)", fontFamily: "var(--font-body)", fontWeight: 600 }}>{selectedRestaurant.mustTry}</div>
                  </div>
                )}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(selectedRestaurant.name + " restaurant Chicago")}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ padding: "8px 18px", background: "var(--noshd-electra)", color: "white", border: "2px solid var(--noshd-electra)", borderRadius: "4px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase", textDecoration: "none", display: "inline-block" }}>
                    website / reservations ↗
                  </a>
                  <button onClick={() => { setSelectedRestaurant(null); goCountry(selectedRestaurant.country); }}
                    style={{ padding: "8px 18px", background: "var(--noshd-tangerine)", color: "white", border: "2px solid var(--noshd-tangerine)", borderRadius: "4px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
                    see all {selectedRestaurant.country} restaurants →
                  </button>
                </div>
              </div>
              <button onClick={() => setSelectedRestaurant(null)}
                style={{ background: "var(--noshd-cream)", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginLeft: "12px" }}>
                <X size={14} color="var(--noshd-muted)" />
              </button>
            </div>
          </div>
        </div>
      )}
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
