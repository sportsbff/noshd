"use client";
import { useState } from "react";
import { MapPin, Star, Map } from "lucide-react";
import { RESTAURANT_LINKS } from "@/data/countries";
import { restKey } from "@/lib/utils";
import SavePanel from "./SavePanel";

export default function RestaurantCard({ country, restaurant, user, saved, onSave, onRemove, compact, hideMapButton }) {
  const [showMap, setShowMap] = useState(false);
  const key = restKey(country, restaurant.name);
  const links = RESTAURANT_LINKS[restaurant.name] || {};
  // Simulated Google rating
  const gRating = ((restaurant.name.length * 7 + country.length * 3) % 7 + 42) / 10;
  const fullStars = Math.floor(gRating);
  const hasHalf = gRating - fullStars >= 0.3;

  return (
    <div style={{ background: "#fff", borderRadius: "4px", padding: compact ? "14px" : "22px", border: "1px solid var(--noshd-border)", transition: "box-shadow 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
        <h3 style={{ margin: 0, color: "var(--noshd-charcoal)", fontSize: compact ? "16px" : "18px", fontWeight: 400, fontFamily: "var(--font-display)", lineHeight: 1.2 }}>{restaurant.name}</h3>
        <span style={{ background: "var(--noshd-cream)", color: "var(--noshd-muted)", borderRadius: "3px", padding: "2px 10px", fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap", marginLeft: "10px", fontFamily: "var(--font-body)", letterSpacing: "0.5px" }}>{restaurant.price}</span>
      </div>

      {/* Location + rating */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
        <a href={`https://www.google.com/maps/search/${encodeURIComponent(restaurant.name + " " + restaurant.neighborhood + " Chicago")}`} target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--noshd-muted)", fontFamily: "var(--font-body)", textDecoration: "none", borderBottom: "1px dashed var(--noshd-border)", paddingBottom: "1px" }}>
          <MapPin size={11} color="var(--noshd-tangerine)" />{restaurant.neighborhood}
        </a>
        <span style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={12}
              color={s <= fullStars ? "#F59E0B" : (s === fullStars + 1 && hasHalf ? "#F59E0B" : "#DDD")}
              fill={s <= fullStars ? "#F59E0B" : (s === fullStars + 1 && hasHalf ? "#F59E0B" : "none")} />
          ))}
          <span style={{ fontSize: "12px", color: "var(--noshd-muted)", fontFamily: "var(--font-body)", marginLeft: "4px" }}>{gRating.toFixed(1)}</span>
        </span>
      </div>

      {/* Description */}
      <p style={{ color: "var(--noshd-muted)", fontSize: "13px", lineHeight: 1.7, marginBottom: "12px", fontFamily: "var(--font-body)" }}>{restaurant.description}</p>

      {/* Must try — tangerine left border */}
      {restaurant.mustTry && (
        <div style={{ borderLeft: "3px solid #FF5500", paddingLeft: "12px", marginBottom: "12px" }}>
          <div style={{ fontSize: "10px", color: "var(--noshd-faint)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px", fontFamily: "var(--font-body)" }}>recommended</div>
          <div style={{ fontSize: "13px", color: "var(--noshd-charcoal)", fontFamily: "var(--font-body)", fontWeight: 600 }}>{restaurant.mustTry}</div>
        </div>
      )}

      {/* Story — banana left border */}
      {restaurant.story && !compact && (
        <div style={{ borderLeft: "3px solid #FFF597", paddingLeft: "12px", marginBottom: "12px" }}>
          <p style={{ fontSize: "12px", color: "var(--noshd-muted)", fontStyle: "italic", lineHeight: 1.6, fontFamily: "var(--font-body)", margin: 0 }}>{restaurant.story}</p>
        </div>
      )}

      {/* Action buttons — one row: website, reserve, map (left) + save (right) */}
      <div style={{ display: "flex", gap: "8px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--noshd-border-faint)", flexWrap: "wrap", alignItems: "center" }}>
        <a href={links.web || `https://www.google.com/search?q=${encodeURIComponent(restaurant.name + " restaurant Chicago")}`} target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, textDecoration: "none", padding: "5px 12px", border: "1.5px solid var(--noshd-border)", borderRadius: "4px", background: "#fff", color: "var(--noshd-muted)", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
          🌐 website
        </a>
        <a href={links.res || `https://www.google.com/search?q=${encodeURIComponent(restaurant.name + " Chicago reservations")}`} target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, textDecoration: "none", padding: "5px 12px", border: "1.5px solid var(--noshd-border)", borderRadius: "4px", background: "#fff", color: "var(--noshd-muted)", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
          📅 reserve
        </a>
        {!hideMapButton && (
          <button onClick={() => setShowMap(!showMap)}
            style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, padding: "5px 12px", border: `1.5px solid ${showMap ? "var(--noshd-electra)" : "var(--noshd-border)"}`, borderRadius: "4px", background: showMap ? "rgba(16,16,255,0.06)" : "#fff", color: showMap ? "var(--noshd-electra)" : "var(--noshd-muted)", fontFamily: "var(--font-body)", textTransform: "lowercase", cursor: "pointer" }}>
            <Map size={12} /> {showMap ? "hide map" : "view on map"}
          </button>
        )}
      </div>
      {/* Save — full width below action buttons, unfurls underneath */}
      <SavePanel user={user} savedEntry={saved?.[key]} onSave={d => onSave?.(key, d)} onRemove={() => onRemove?.(key)} />
      {/* Google Maps embed */}
      {!hideMapButton && showMap && (
        <div style={{ marginTop: "10px", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--noshd-border)" }}>
          <iframe
            width="100%"
            height="300"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(restaurant.name + " " + restaurant.neighborhood + " Chicago")}&output=embed&z=15`}
            allowFullScreen
          />
          <div style={{ padding: "8px 12px", background: "var(--noshd-cream)", fontSize: "11px", color: "var(--noshd-faint)", fontFamily: "var(--font-body)" }}>
            <a href={`https://www.google.com/maps/search/${encodeURIComponent(restaurant.name + " " + restaurant.neighborhood + " Chicago")}`}
              target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--noshd-electra)", textDecoration: "none", fontWeight: 600 }}>
              open in google maps →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
