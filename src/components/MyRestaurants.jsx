"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, List, MapPin, Star, Globe, X, SlidersHorizontal } from "lucide-react";
import { COUNTRY_DATA, COORDS, HOOD_COORDS } from "@/data/countries";
import { restKey } from "@/lib/utils";
import RestaurantCard from "./RestaurantCard";

const COUNTRY_COORDS = {
  Afghanistan:[33.9,-67.7],Albania:[41.3,20.2],Algeria:[36.8,3.0],Andorra:[42.5,1.5],
  Angola:[-8.8,13.2],Argentina:[-34.6,-58.4],Armenia:[40.2,44.5],Australia:[-25.3,133.8],
  Austria:[48.2,16.4],Azerbaijan:[40.4,49.9],Bahamas:[25.0,-77.4],Bahrain:[26.2,50.6],
  Bangladesh:[23.7,90.4],Barbados:[13.1,-59.6],Belarus:[53.9,27.6],Belgium:[50.8,4.4],
  Belize:[17.5,-88.5],Benin:[6.5,2.6],Bhutan:[27.5,89.6],Bolivia:[-16.5,-68.1],
  "Bosnia and Herzegovina":[43.9,18.4],Botswana:[-22.3,24.7],Brazil:[-15.8,-47.9],
  Brunei:[4.9,114.9],Bulgaria:[42.7,23.3],"Burkina Faso":[12.4,-1.5],Burundi:[-3.4,29.4],
  "Cabo Verde":[14.9,-23.5],Cambodia:[11.6,104.9],Cameroon:[3.9,11.5],Canada:[56.1,-106.3],
  "Central African Republic":[4.6,18.6],Chad:[12.1,15.1],Chile:[-33.4,-70.7],
  China:[35.9,104.2],Colombia:[4.7,-74.1],Comoros:[-11.7,43.3],"Congo (DRC)":[-4.3,15.3],
  "Costa Rica":[9.9,-84.1],Croatia:[45.8,16.0],Cuba:[21.5,-77.8],Cyprus:[35.2,33.4],
  "Czech Republic":[50.1,14.4],Denmark:[55.7,12.6],"Dominican Republic":[18.5,-69.9],
  Ecuador:[-0.2,-78.5],Egypt:[26.8,30.8],"El Salvador":[13.7,-89.2],Eritrea:[15.3,38.9],
  Estonia:[59.4,24.7],Ethiopia:[9.0,38.7],Fiji:[-17.7,178.0],Finland:[60.2,24.9],
  France:[46.2,2.2],Gabon:[-0.8,11.6],Georgia:[42.3,43.4],Germany:[51.2,10.4],
  Ghana:[5.6,-0.2],Greece:[37.9,23.7],Guatemala:[14.6,-90.5],Guinea:[9.9,-13.7],
  Haiti:[18.5,-72.3],Honduras:[14.1,-87.2],Hungary:[47.5,19.0],Iceland:[64.1,-21.9],
  India:[20.6,78.9],Indonesia:[-0.8,113.9],Iran:[32.4,53.7],Iraq:[33.3,44.4],
  Ireland:[53.1,-7.7],Israel:[31.8,34.8],Italy:[41.9,12.5],Jamaica:[18.1,-77.3],
  Japan:[36.2,138.3],Jordan:[30.6,36.2],Kazakhstan:[48.0,68.0],Kenya:[-1.3,36.8],
  Korea:[37.6,127.0],Kuwait:[29.3,47.5],Laos:[18.0,102.6],Latvia:[56.9,24.1],
  Lebanon:[33.9,35.5],Libya:[26.3,17.2],Lithuania:[54.7,25.3],Luxembourg:[49.6,6.1],
  Madagascar:[-18.9,47.5],Malaysia:[4.2,101.7],Mali:[17.6,-4.0],Malta:[35.9,14.5],
  Mexico:[23.6,-102.5],Moldova:[47.0,28.8],Mongolia:[47.9,106.9],Morocco:[33.6,-7.6],
  Mozambique:[-25.9,32.6],Myanmar:[19.8,96.2],Nepal:[27.7,85.3],Netherlands:[52.4,4.9],
  "New Zealand":[-40.9,174.9],Nicaragua:[12.1,-86.3],Niger:[13.5,2.1],Nigeria:[9.1,7.5],
  Norway:[59.9,10.7],Oman:[23.6,58.5],Pakistan:[33.7,73.0],Panama:[9.0,-79.5],
  Paraguay:[-25.3,-57.6],Peru:[-12.0,-77.0],Philippines:[14.6,121.0],Poland:[52.2,21.0],
  Portugal:[38.7,-9.1],"Puerto Rico":[18.2,-66.6],Qatar:[25.3,51.5],Romania:[44.4,26.1],
  Russia:[55.8,37.6],Rwanda:[-1.9,29.9],"Saudi Arabia":[24.7,46.7],Senegal:[14.7,-17.4],
  Serbia:[44.8,20.5],Singapore:[1.4,103.8],Slovakia:[48.1,17.1],Slovenia:[46.1,14.5],
  Somalia:[2.0,45.3],"South Africa":[-25.7,28.2],Spain:[40.4,-3.7],"Sri Lanka":[7.9,80.8],
  Sudan:[15.5,32.6],Sweden:[59.3,18.1],Switzerland:[46.9,7.4],Syria:[33.5,36.3],
  Taiwan:[25.0,121.5],Tanzania:[-6.8,37.3],Thailand:[13.8,100.5],Togo:[6.1,1.2],
  "Trinidad and Tobago":[10.5,-61.3],Tunisia:[36.8,10.2],Turkey:[39.9,32.9],
  Uganda:[0.3,32.6],Ukraine:[50.4,30.5],"United Arab Emirates":[24.5,54.7],
  "United Kingdom":[51.5,-0.1],"United States":[39.8,-98.6],Uruguay:[-34.9,-56.2],
  Uzbekistan:[41.3,69.3],Venezuela:[10.5,-66.9],Vietnam:[14.1,108.3],Yemen:[15.6,48.5],
  Zambia:[-15.4,28.3],Zimbabwe:[-17.8,31.1],
  "Antigua and Barbuda":[17.1,-61.8],"Congo (Republic)":[4.3,15.3],"Ivory Coast":[5.3,-4.0],
  "South Korea":[37.6,127.0],"North Korea":[39.0,125.8],"South Sudan":[4.9,31.6],
  "East Timor":[-8.6,125.7],"Papua New Guinea":[-6.3,143.9],
  Samoa:[-13.8,-172.0],Tonga:[-21.2,-175.2],
};

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

function LeafletMap({ entries, center, zoom, pinFn, height, onPinClick, useCluster }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then(async (L) => {
      if (useCluster) await loadMarkerCluster();
      if (cancelled || !containerRef.current) return;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      const map = L.map(containerRef.current, { scrollWheelZoom: true }).setView(center, zoom);
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      const pins = pinFn(L, entries);

      if (useCluster && L.MarkerClusterGroup) {
        const clusterGroup = L.markerClusterGroup({
          maxClusterRadius: 40,
          iconCreateFunction: (cluster) => {
            const count = cluster.getChildCount();
            return L.divIcon({
              html: `<div style="background:#FF5500;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white;">${count}</div>`,
              className: "",
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            });
          },
        });
        pins.forEach(({ marker, data }) => {
          if (onPinClick) marker.on("click", () => onPinClick(data));
          clusterGroup.addLayer(marker);
        });
        map.addLayer(clusterGroup);
      } else {
        pins.forEach(({ marker, data }) => {
          marker.addTo(map);
          if (onPinClick) marker.on("click", () => onPinClick(data));
        });
      }

      // Fit bounds to all pins
      const coords = pins.map(p => p.marker.getLatLng());
      if (coords.length > 1) {
        map.fitBounds(coords.map(c => [c.lat, c.lng]), { padding: [40, 40], maxZoom: 14 });
      }

      setTimeout(() => map.invalidateSize(), 100);
    });
    return () => { cancelled = true; if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [entries, center, zoom, useCluster]);

  return <div ref={containerRef} style={{ width: "100%", height: `${height}px`, borderRadius: "4px" }} />;
}

export default function MyRestaurants({ user, saved, onSave, onRemove, onBack }) {
  const [view, setView] = useState("list");
  const [subView, setSubView] = useState("status");
  const [expandedKey, setExpandedKey] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null); // for popup
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedHood, setSelectedHood] = useState(null);
  const [showMapFilter, setShowMapFilter] = useState(false);
  const [mapStatusFilter, setMapStatusFilter] = useState("all"); // "all"|"favorite"|"visited"|"want"
  const [mapCountryFilter, setMapCountryFilter] = useState([]); // empty = show all

  const entries = Object.entries(saved).map(([key, data]) => {
    const [c, ...rest] = key.split("||");
    const rName = rest.join("||");
    const countryData = COUNTRY_DATA[c];
    const restaurant = countryData?.restaurants.find(r => r.name === rName);
    return restaurant ? { key, country: c, restaurant, ...data } : null;
  }).filter(Boolean);

  // Apply map filters
  const filteredEntries = entries.filter(e => {
    if (mapStatusFilter !== "all" && e.status !== mapStatusFilter) return false;
    if (mapCountryFilter.length > 0 && !mapCountryFilter.includes(e.country)) return false;
    return true;
  });

  const favs = entries.filter(e => e.status === "favorite");
  const visited = entries.filter(e => e.status === "visited");
  const wantToGo = entries.filter(e => e.status === "want");

  const byCountry = {};
  entries.forEach(e => {
    if (!byCountry[e.country]) byCountry[e.country] = [];
    byCountry[e.country].push(e);
  });
  const sortedCountries = Object.keys(byCountry).sort();
  const allCountries = [...new Set(entries.map(e => e.country))].sort();

  const byHood = {};
  entries.forEach(e => {
    const hood = e.restaurant.neighborhood;
    if (!byHood[hood]) byHood[hood] = [];
    byHood[hood].push(e);
  });

  const handleViewChange = (v) => {
    setView(v);
    setSubView(v === "list" ? "status" : "world");
    setSelectedCountry(null);
    setSelectedHood(null);
    setSelectedEntry(null);
    setExpandedKey(null);
  };

  if (!entries.length) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "10px" }}>📍</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "20px", color: "var(--noshd-charcoal)", marginBottom: "6px" }}>no saved restaurants yet</h2>
        <p style={{ fontSize: "13px", lineHeight: 1.5, color: "var(--noshd-muted)", fontFamily: "var(--font-body)", marginBottom: "16px" }}>
          explore and save restaurants to track where you&apos;ve noshd.
        </p>
        <button onClick={onBack}
          style={{ padding: "10px 24px", background: "var(--noshd-charcoal)", color: "white", border: "2px solid var(--noshd-charcoal)", borderRadius: "4px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
          start exploring
        </button>
      </div>
    );
  }

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

  const toggleBtnStyle = (active) => ({
    display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px",
    border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px",
    fontWeight: 600, fontFamily: "var(--font-body)",
    background: active ? "var(--noshd-charcoal)" : "transparent",
    color: active ? "white" : "var(--noshd-muted)", textTransform: "lowercase",
  });

  const subToggleStyle = (active) => ({
    padding: "5px 12px", border: "none", borderRadius: "4px", cursor: "pointer",
    fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-body)",
    background: active ? "var(--noshd-charcoal)" : "transparent",
    color: active ? "white" : "var(--noshd-muted)", textTransform: "lowercase",
  });

  const worldPinFn = (L, entries) => {
    const grouped = {};
    entries.forEach(e => {
      if (!grouped[e.country]) grouped[e.country] = [];
      grouped[e.country].push(e);
    });
    const pins = [];
    Object.entries(grouped).forEach(([country, items]) => {
      const coords = COUNTRY_COORDS[country];
      if (!coords) return;
      const hasFav = items.some(e => e.status === "favorite");
      const hasVisited = items.some(e => e.status === "visited");
      let emoji = "🔵";
      if (hasFav) emoji = "⭐";
      else if (hasVisited) emoji = "📍";
      const icon = L.divIcon({
        html: `<div style="font-size:24px;line-height:1;text-align:center;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3))">${emoji}</div>`,
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
      const marker = L.marker(coords, { icon });
      marker.bindTooltip(`${COUNTRY_DATA[country]?.flag || ""} ${country} (${items.length})`, { direction: "top", offset: [0, -10] });
      pins.push({ marker, data: { type: "country", country, items } });
    });
    return pins;
  };

  const localPinFn = (L, entries) => {
    const pins = [];
    entries.forEach(e => {
      const coords = COORDS[e.restaurant.neighborhood] || HOOD_COORDS[e.restaurant.neighborhood];
      if (!coords) return;
      const jitterLat = (Math.random() - 0.5) * 0.003;
      const jitterLng = (Math.random() - 0.5) * 0.003;
      const icon = L.divIcon({
        html: `<span style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.3));cursor:pointer;">📍</span>`,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 22],
      });
      const marker = L.marker([coords[0] + jitterLat, coords[1] + jitterLng], { icon });
      marker.bindTooltip(`${COUNTRY_DATA[e.country]?.flag || ""} ${e.restaurant.name}`, { direction: "top", offset: [0, -10] });
      pins.push({ marker, data: { type: "restaurant", entry: e } });
    });
    return pins;
  };

  const handleMapPinClick = (data) => {
    if (data.type === "country") {
      setSelectedCountry(selectedCountry === data.country ? null : data.country);
      setSelectedEntry(null);
    } else if (data.type === "restaurant") {
      setSelectedEntry(data.entry);
    }
  };

  const mapFilterChip = (value, label) => (
    <button onClick={() => setMapStatusFilter(value)}
      style={{
        padding: "4px 10px", border: `1.5px solid ${mapStatusFilter === value ? "var(--noshd-accent)" : "var(--noshd-border)"}`,
        borderRadius: "50px", background: mapStatusFilter === value ? "var(--noshd-accent-bg)" : "transparent",
        color: mapStatusFilter === value ? "var(--noshd-accent)" : "var(--noshd-muted)",
        fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase",
      }}>
      {label}
    </button>
  );

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 20px 60px", animation: "fadeUp 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 400, color: "var(--noshd-charcoal)" }}>my restaurants</h1>
        <span style={{ fontSize: "13px", color: "var(--noshd-muted)", fontFamily: "var(--font-body)" }}>{entries.length} saved</span>
      </div>

      {/* Main toggle: list | map */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--noshd-cream)", borderRadius: "4px", padding: "3px", width: "fit-content", marginBottom: "8px", border: "1px solid var(--noshd-border)" }}>
        <button onClick={() => handleViewChange("list")} style={toggleBtnStyle(view === "list")}><List size={13} />list</button>
        <button onClick={() => handleViewChange("map")} style={toggleBtnStyle(view === "map")}><MapPin size={13} />map</button>
      </div>

      {/* Sub-toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--noshd-cream)", borderRadius: "4px", padding: "3px", border: "1px solid var(--noshd-border)" }}>
          {view === "list" ? (
            <>
              <button onClick={() => { setSubView("status"); setExpandedKey(null); }} style={subToggleStyle(subView === "status")}>by status</button>
              <button onClick={() => { setSubView("country"); setExpandedKey(null); }} style={subToggleStyle(subView === "country")}>by country</button>
            </>
          ) : (
            <>
              <button onClick={() => { setSubView("world"); setSelectedCountry(null); setSelectedEntry(null); }} style={subToggleStyle(subView === "world")}>world map</button>
              <button onClick={() => { setSubView("local"); setSelectedHood(null); setSelectedEntry(null); }} style={subToggleStyle(subView === "local")}>local map</button>
            </>
          )}
        </div>
        {view === "map" && (
          <button onClick={() => setShowMapFilter(!showMapFilter)}
            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", border: `1.5px solid ${showMapFilter ? "var(--noshd-electra)" : "var(--noshd-border)"}`, borderRadius: "4px", background: showMapFilter ? "rgba(16,16,255,0.06)" : "transparent", color: showMapFilter ? "var(--noshd-electra)" : "var(--noshd-muted)", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
            <SlidersHorizontal size={12} /> customize map
          </button>
        )}
      </div>

      {/* Map filters */}
      {view === "map" && showMapFilter && (
        <div style={{ background: "#fff", border: "1px solid var(--noshd-border)", borderRadius: "4px", padding: "14px 16px", marginBottom: "16px", animation: "fadeUp 0.2s ease" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--noshd-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", fontFamily: "var(--font-body)" }}>filter by status</div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            {mapFilterChip("all", "all")}
            {mapFilterChip("favorite", "⭐ favorites")}
            {mapFilterChip("visited", "📍 visited")}
            {mapFilterChip("want", "🔵 want to go")}
          </div>
          {allCountries.length > 1 && (
            <>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--noshd-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", fontFamily: "var(--font-body)" }}>filter by country</div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                <button onClick={() => setMapCountryFilter([])}
                  style={{ padding: "4px 10px", border: `1.5px solid ${mapCountryFilter.length === 0 ? "var(--noshd-accent)" : "var(--noshd-border)"}`, borderRadius: "50px", background: mapCountryFilter.length === 0 ? "var(--noshd-accent-bg)" : "transparent", color: mapCountryFilter.length === 0 ? "var(--noshd-accent)" : "var(--noshd-muted)", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                  all
                </button>
                {allCountries.map(c => {
                  const active = mapCountryFilter.includes(c);
                  return (
                    <button key={c} onClick={() => {
                      setMapCountryFilter(prev => active ? prev.filter(x => x !== c) : [...prev, c]);
                    }}
                      style={{ padding: "4px 10px", border: `1.5px solid ${active ? "var(--noshd-accent)" : "var(--noshd-border)"}`, borderRadius: "50px", background: active ? "var(--noshd-accent-bg)" : "transparent", color: active ? "var(--noshd-accent)" : "var(--noshd-muted)", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                      {COUNTRY_DATA[c]?.flag} {c}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && subView === "status" && (
        <>
          {renderSection(favs, "favorites", "⭐")}
          {renderSection(wantToGo, "want to go", "🔵")}
          {renderSection(visited, "visited", "🔴")}
        </>
      )}

      {view === "list" && subView === "country" && (
        <>
          {sortedCountries.map(country => {
            const items = byCountry[country];
            const flag = COUNTRY_DATA[country]?.flag || "";
            return (
              <div key={country} style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", paddingBottom: "8px", borderBottom: "1px solid var(--noshd-border)", color: "var(--noshd-muted)", fontFamily: "var(--font-body)" }}>
                  {flag} {country} — {items.length}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {items.map(renderEntry)}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* MAP VIEW - WORLD */}
      {view === "map" && subView === "world" && (
        <div style={{ background: "#fff", borderRadius: "4px", border: "1px solid var(--noshd-border)", padding: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--noshd-muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", fontFamily: "var(--font-body)" }}>🌍 saved restaurants around the world</div>
          <LeafletMap
            entries={filteredEntries}
            center={[20, 0]}
            zoom={2}
            height={350}
            pinFn={worldPinFn}
            onPinClick={handleMapPinClick}
          />
          {selectedCountry && byCountry[selectedCountry] && (
            <div style={{ marginTop: "16px", animation: "fadeUp 0.2s ease" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--noshd-charcoal)", fontFamily: "var(--font-display)" }}>
                  {COUNTRY_DATA[selectedCountry]?.flag} {selectedCountry} — {byCountry[selectedCountry].length} saved
                </div>
                <button onClick={() => setSelectedCountry(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--noshd-muted)", padding: "4px" }}><X size={14} /></button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {byCountry[selectedCountry].map(e => renderEntry(e))}
              </div>
            </div>
          )}
          <div style={{ fontSize: "11px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)", textAlign: "center", marginTop: "12px" }}>
            ⭐ favorite &nbsp; 📍 visited &nbsp; 🔵 want to go &mdash; click a pin to see restaurants
          </div>
        </div>
      )}

      {/* MAP VIEW - LOCAL */}
      {view === "map" && subView === "local" && (
        <div style={{ background: "#fff", borderRadius: "4px", border: "1px solid var(--noshd-border)", padding: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--noshd-muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", fontFamily: "var(--font-body)" }}>📍 my saved restaurants in chicago</div>
          <LeafletMap
            entries={filteredEntries}
            center={[41.88, -87.65]}
            zoom={11}
            height={350}
            pinFn={localPinFn}
            onPinClick={handleMapPinClick}
            useCluster
          />
          <div style={{ fontSize: "11px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)", textAlign: "center", marginTop: "12px" }}>click a pin to see details &middot; zoom in to unfurl clusters</div>
        </div>
      )}

      {/* Popup overlay for selected restaurant from map */}
      {selectedEntry && (
        <div style={{ position: "fixed", inset: 0, zIndex: 250, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", animation: "fadeUp 0.2s ease" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedEntry(null); }}>
          <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", border: "1px solid var(--noshd-border)", maxHeight: "80vh", overflowY: "auto", width: "min(520px, 92vw)", margin: "20px" }}>
            <div style={{ position: "sticky", top: 0, background: "#fff", padding: "12px 16px 0", display: "flex", justifyContent: "flex-end", zIndex: 2, borderRadius: "8px 8px 0 0" }}>
              <button onClick={() => setSelectedEntry(null)}
                style={{ background: "var(--noshd-cream)", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={14} color="var(--noshd-muted)" />
              </button>
            </div>
            <div style={{ padding: "0 16px 16px" }}>
              <RestaurantCard
                country={selectedEntry.country}
                restaurant={selectedEntry.restaurant}
                user={user}
                saved={saved}
                onSave={onSave}
                onRemove={onRemove}
                hideMapButton
              />
              <a href={`https://www.google.com/search?q=${encodeURIComponent(selectedEntry.restaurant.name + " restaurant Chicago")}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "block", textAlign: "center", margin: "12px 0 0", padding: "8px 18px", background: "var(--noshd-electra)", color: "white", border: "2px solid var(--noshd-electra)", borderRadius: "4px", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-body)", textTransform: "lowercase", textDecoration: "none" }}>
                website / reservations ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
