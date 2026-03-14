"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, List, MapPin, X } from "lucide-react";
import { COUNTRY_DATA, COORDS, HOOD_COORDS } from "@/data/countries";
import RestaurantCard from "./RestaurantCard";

function loadLeaflet() {
  return new Promise((resolve) => {
    if (window.L) { resolve(window.L); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve(window.L);
    document.head.appendChild(script);
  });
}

function loadMarkerCluster() {
  return new Promise((resolve) => {
    if (window.L?.MarkerClusterGroup) { resolve(); return; }
    // CSS
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

export default function CountryPage({ country, user, saved, onSave, onRemove, onBack }) {
  const data = COUNTRY_DATA[country];
  const [cpView, setCpView] = useState("list");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (cpView !== "map" || !data) return;
    let cancelled = false;

    loadLeaflet().then(async (L) => {
      await loadMarkerCluster();
      if (cancelled) return;
      const container = mapContainerRef.current;
      if (!container) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(container, {
        center: [41.88, -87.65],
        zoom: 11,
        scrollWheelZoom: true,
      });
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Use marker cluster group
      const clusterGroup = L.markerClusterGroup({
        maxClusterRadius: 40,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `<div style="background:#FF5500;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;font-family:var(--font-body);box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white;">${count}</div>`,
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });
        },
      });

      const bounds = [];
      data.restaurants.forEach((r) => {
        const coords = COORDS[r.neighborhood] || HOOD_COORDS[r.neighborhood];
        if (!coords) return;

        const jitterLat = (Math.random() - 0.5) * 0.004;
        const jitterLng = (Math.random() - 0.5) * 0.004;
        const lat = coords[0] + jitterLat;
        const lng = coords[1] + jitterLng;
        bounds.push([lat, lng]);

        const icon = L.divIcon({
          html: `<span style="font-size:24px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.3));cursor:pointer;">📍</span>`,
          className: "",
          iconSize: [26, 26],
          iconAnchor: [13, 24],
        });

        const marker = L.marker([lat, lng], { icon });
        marker.bindTooltip(r.name, { direction: "top", offset: [0, -12] });
        marker.on("click", () => setSelectedRestaurant(r));
        clusterGroup.addLayer(marker);
      });

      map.addLayer(clusterGroup);

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 14);
      }

      setTimeout(() => map.invalidateSize(), 100);
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [cpView, data]);

  if (!data) return null;

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
        <div style={{ position: "relative" }}>
          <div style={{ background: "#fff", borderRadius: "4px", border: "1px solid var(--noshd-border)", padding: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--noshd-muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontFamily: "var(--font-body)" }}>
              {data.flag} {country.toLowerCase()} restaurants in chicago
            </div>
            <div
              ref={mapContainerRef}
              style={{ width: "100%", height: "320px", borderRadius: "4px", border: "1px solid var(--noshd-border)", position: "relative", zIndex: 1 }}
            />
            <div style={{ fontSize: "11px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)", textAlign: "center", marginTop: "10px" }}>tap a pin to see restaurant details &middot; zoom in to unfurl clusters</div>
          </div>

          {/* Popup overlay for selected restaurant */}
          {selectedRestaurant && (
            <div style={{ position: "fixed", inset: 0, zIndex: 250, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", animation: "fadeUp 0.2s ease" }}
              onClick={(e) => { if (e.target === e.currentTarget) setSelectedRestaurant(null); }}>
              <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", border: "1px solid var(--noshd-border)", maxHeight: "80vh", overflowY: "auto", width: "min(520px, 92vw)", margin: "20px" }}>
                <div style={{ position: "sticky", top: 0, background: "#fff", padding: "12px 16px 0", display: "flex", justifyContent: "flex-end", zIndex: 2, borderRadius: "8px 8px 0 0" }}>
                  <button onClick={() => setSelectedRestaurant(null)}
                    style={{ background: "var(--noshd-cream)", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <X size={14} color="var(--noshd-muted)" />
                  </button>
                </div>
                <div style={{ padding: "0 16px 16px" }}>
                  <RestaurantCard
                    country={country}
                    restaurant={selectedRestaurant}
                    user={user}
                    saved={saved}
                    onSave={onSave}
                    onRemove={onRemove}
                    hideMapButton
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
