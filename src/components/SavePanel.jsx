"use client";
import { useState } from "react";
import { Bookmark, BookmarkPlus, Star, X } from "lucide-react";

export default function SavePanel({ user, savedEntry, onSave, onRemove }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(savedEntry?.status || "visited");
  const [rating, setRating] = useState(savedEntry?.rating || 0);
  const [note, setNote] = useState(savedEntry?.note || "");
  const isSaved = !!savedEntry;

  if (!user) return null;

  return (
    <div style={{ marginTop: "10px", paddingTop: "10px" }}>
      {!open ? (
        <button onClick={() => setOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: "6px", background: "none",
            border: `1.5px solid ${isSaved ? "#FF5500" : "var(--noshd-border)"}`,
            borderRadius: "4px", padding: "6px 12px", cursor: "pointer",
            fontSize: "13px", color: isSaved ? "#FF5500" : "var(--noshd-muted)",
            fontWeight: 600, fontFamily: "var(--font-body)", textTransform: "lowercase",
          }}>
          {isSaved ? <Bookmark size={13} fill="#FF5500" color="#FF5500" /> : <BookmarkPlus size={13} />}
          {isSaved ? (savedEntry.status === "favorite" ? "⭐ favorited" : savedEntry.status === "want" ? "🔵 want to go" : "🔴 visited") : "save"}
        </button>
      ) : (
        <div style={{ background: "var(--noshd-cream)", borderRadius: "4px", padding: "12px" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            {[["want", "🔵 want to go"], ["visited", "🔴 visited"], ["favorite", "⭐ favorite"]].map(([v, l]) => (
              <button key={v} onClick={() => setStatus(v)}
                style={{
                  flex: 1, padding: "7px",
                  border: `1.5px solid ${status === v ? "#FF5500" : "var(--noshd-border)"}`,
                  borderRadius: "4px",
                  background: status === v ? "var(--noshd-accent-bg)" : "#fff",
                  fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  color: status === v ? "#FF5500" : "var(--noshd-muted)",
                  fontFamily: "var(--font-body)", textTransform: "lowercase",
                }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "3px", marginBottom: "8px" }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} onClick={() => setRating(s)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 1px" }}>
                <Star size={18} color={s <= rating ? "#F59E0B" : "#DDD"} fill={s <= rating ? "#F59E0B" : "none"} />
              </button>
            ))}
          </div>
          <input placeholder="add a note..." value={note} onChange={e => setNote(e.target.value)}
            style={{ width: "100%", padding: "7px 10px", border: "1.5px solid var(--noshd-border)", borderRadius: "4px", fontSize: "13px", marginBottom: "8px", boxSizing: "border-box", fontFamily: "var(--font-body)", color: "var(--noshd-charcoal)" }} />
          <div style={{ display: "flex", gap: "6px" }}>
            {isSaved && (
              <button onClick={() => { onRemove(); setOpen(false); }}
                style={{ padding: "7px 12px", border: "1.5px solid var(--noshd-border)", borderRadius: "4px", background: "none", fontSize: "12px", cursor: "pointer", color: "var(--noshd-muted)", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
                remove
              </button>
            )}
            <button onClick={() => { onSave({ status, rating, note }); setOpen(false); }}
              style={{ flex: 1, padding: "7px", background: "var(--noshd-charcoal)", color: "white", border: "2px solid var(--noshd-charcoal)", borderRadius: "4px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>
              save
            </button>
            <button onClick={() => setOpen(false)}
              style={{ padding: "7px 10px", border: "1.5px solid var(--noshd-border)", borderRadius: "4px", background: "none", cursor: "pointer", color: "var(--noshd-muted)" }}>
              <X size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
