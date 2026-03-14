"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, List, MapPin } from "lucide-react";
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

export default function CountryPage({ country, user, saved, onSave, onRemove, onBack }) {
  const data = COUNTRY_DATA[country];
  const [cpView, setCpView] = useState("list");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (cpView !== "map" || !data) return;
    let cancelled = false;

    loadLeaflet().then((L) => {
      if (cancelled) return;
      const container = mapContainerRef.current;
      if (!container) return;

      // Destroy previous map if any
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

      // Place markers for each restaurant
      data.restaurants.forEach((r) => {
        const coords = COORDS[r.neighborhood] || HOOD_COORDS[r.neighborhood];
        if (!coords) return;

        // Add small random jitter to prevent overlapping
        const jitterLat = (Math.random() - 0.5) * 0.006;
        const jitterLng = (Math.random() - 0.5) * 0.006;
        const lat = coords[0] + jitterLat;
        const lng = coords[1] + jitterLng;

        const icon = L.divIcon({
          html: `<span style="font-size:24px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3));cursor:pointer;">${data.flag}</span>`,
          className: "",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([lat, lng], { icon }).addTo(map);
        marker.bindTooltip(r.name, {
          direction: "top",
          offset: [0, -10],
          className: "",
        });
        marker.on("click", () => {
          setSelectedRestaurant(r);
        });
      });

      // Fix tiles not rendering fully on first load
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
        <div style={{ background: "#fff", borderRadius: "4px", border: "1px solid var(--noshd-border)", padding: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--noshd-muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", fontFamily: "var(--font-body)" }}>
            {data.flag} {country.toLowerCase()} restaurants in chicago
          </div>
          <div
            ref={mapContainerRef}
            style={{ width: "100%", height: "420px", borderRadius: "4px", border: "1px solid var(--noshd-border)" }}
          />
          {selectedRestaurant && (
            <div style={{ marginTop: "16px", animation: "fadeUp 0.2s ease" }}>
              <RestaurantCard
                country={country}
                restaurant={selectedRestaurant}
                user={user}
                saved={saved}
                onSave={onSave}
                onRemove={onRemove}
              />
            </div>
          )}
          <div style={{ fontSize: "11px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)", textAlign: "center", marginTop: "12px" }}>click a pin to see restaurant details</div>
        </div>
      )}
    </div>
  );
}
