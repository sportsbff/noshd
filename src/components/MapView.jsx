"use client";
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { COORDS } from "@/data/countries";
import { restKey } from "@/lib/utils";
import RestaurantCard from "./RestaurantCard";

export default function MapView({ restaurants, country: countryName, countryColor, user, saved, onSave, onRemove }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.L) { setReady(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => setReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current) return;
    const L = window.L;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    const map = L.map(containerRef.current).setView([41.88, -87.65], 11);
    mapRef.current = map;
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 18,
    }).addTo(map);
    const color = countryColor || "#E04832";
    const bounds = [];
    restaurants.forEach((r, i) => {
      const hood = r.neighborhood.split("(")[0].trim();
      const coords = COORDS[r.neighborhood] || COORDS[hood];
      if (!coords) return;
      const jitter = [(Math.random() - 0.5) * 0.004, (Math.random() - 0.5) * 0.004];
      const pos = [coords[0] + jitter[0], coords[1] + jitter[1]];
      bounds.push(pos);
      const key = restKey(r._country || countryName || "", r.name);
      const isFav = saved?.[key]?.status === "favorite";
      const isVisited = !!saved?.[key];
      const pinHtml = isFav
        ? '<div style="font-size:18px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.4))">⭐</div>'
        : `<div style="width:14px;height:14px;border-radius:50%;background:${isVisited ? "#E04832" : color};border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>`;
      const icon = L.divIcon({ html: pinHtml, iconSize: [18, 18], iconAnchor: [9, 9], popupAnchor: [0, -10], className: "" });
      const m = L.marker(pos, { icon }).addTo(map);
      m.on("click", () => setSelected(i));
      m.bindTooltip(r.name, { permanent: false, direction: "top", offset: [0, -6] });
    });
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    }
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [ready, restaurants, countryColor, saved, countryName]);

  return (
    <div>
      {ready ? (
        <div ref={containerRef} className="w-full rounded overflow-hidden border border-[var(--noshd-grey-200)]" style={{ height: "380px" }}/>
      ) : (
        <div className="flex items-center justify-center rounded text-sm" style={{
          height: "380px", background: "var(--noshd-grey-100)", color: "var(--noshd-grey-600)", fontFamily: "var(--font-body)"
        }}>loading map...</div>
      )}
      <div className="text-[11px] text-center mt-1.5" style={{ color: "var(--noshd-grey-400)", fontFamily: "var(--font-body)" }}>
        click a pin to see details
      </div>
      {selected !== null && restaurants[selected] && (
        <div className="mt-3.5" style={{ animation: "fadeUp 0.2s ease" }}>
          <div className="flex justify-between mb-2">
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--noshd-grey-600)", fontFamily: "var(--font-body)" }}>selected</div>
            <button onClick={() => setSelected(null)} className="bg-transparent border-none cursor-pointer" style={{ color: "var(--noshd-grey-400)" }}><X size={14}/></button>
          </div>
          <RestaurantCard country={restaurants[selected]._country || countryName || ""} restaurant={restaurants[selected]} user={user} saved={saved} onSave={onSave} onRemove={onRemove} compact/>
        </div>
      )}
    </div>
  );
}
