"use client";
import { useState, useRef, useEffect } from "react";
import { COUNTRY_DATA, WHEEL_COLORS, WHEEL_COLORS_MAP } from "@/data/countries";

export default function SpinWheel({ countries, onResult }) {
  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const animRef = useRef(null);
  const countriesRef = useRef(countries);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => { countriesRef.current = countries; }, [countries]);

  const draw = (angle) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const W = canvas.width / dpr, H = canvas.height / dpr, cx = W / 2, cy = H / 2, r = cx - 20;
    const segs = countriesRef.current, n = segs.length, seg = (2 * Math.PI) / n;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    // Thin outer ring
    ctx.beginPath(); ctx.arc(cx, cy, r + 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFFFF"; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, r + 4, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(28,25,23,0.08)"; ctx.lineWidth = 1; ctx.stroke();

    // Segments
    segs.forEach((country, i) => {
      const start = angle + i * seg, end = start + seg;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, end); ctx.closePath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length]; ctx.fill();

      // Subtle dot pattern on every other segment
      if (i % 2 === 0) {
        ctx.save();
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, end); ctx.closePath(); ctx.clip();
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        for (let px = 0; px < W; px += 8) { for (let py = 0; py < H; py += 8) { ctx.fillRect(px, py, 1.5, 1.5); } }
        ctx.restore();
      }

      // Thin white divider
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(start) * r, cy + Math.sin(start) * r);
      ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 0.5; ctx.stroke();

      // Country label — centered in segment with pill background
      const mid = start + seg / 2;
      const labelR = r * 0.6;
      const lx = cx + Math.cos(mid) * labelR;
      const ly = cy + Math.sin(mid) * labelR;
      ctx.save(); ctx.translate(lx, ly);
      let tAngle = mid;
      if (tAngle > Math.PI / 2 && tAngle < 3 * Math.PI / 2) { tAngle += Math.PI; }
      ctx.rotate(tAngle);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const segColor = WHEEL_COLORS[i % WHEEL_COLORS.length];
      const textColor = WHEEL_COLORS_MAP[i % WHEEL_COLORS_MAP.length][1];
      const isLight = segColor === "#FFB000" || segColor === "#A4DDFF" || segColor === "#F4F7FC";

      // Measure text for pill — responsive font size based on segment and wheel size
      const maxFontSize = n > 16 ? 10 : n > 12 ? 11 : 12;
      const label = `${COUNTRY_DATA[country]?.flag || ""} ${country}`;

      // Max text width scales with wheel radius — never exceed segment length
      const maxTextW = Math.min(r * 0.48, seg * r * 0.55);
      let fontSize = maxFontSize;
      ctx.font = `400 ${fontSize}px 'Young Serif',Georgia,serif`;
      let textW = ctx.measureText(label).width;
      while (textW > maxTextW && fontSize > 6) {
        fontSize -= 0.5;
        ctx.font = `400 ${fontSize}px 'Young Serif',Georgia,serif`;
        textW = ctx.measureText(label).width;
      }

      // Draw pill background
      const pillPad = 6, pillH = fontSize + 8, pillW = textW + pillPad * 2 + 4;
      const pillR = pillH / 2;
      ctx.beginPath();
      ctx.roundRect(-pillW / 2, -pillH / 2, pillW, pillH, pillR);
      ctx.fillStyle = isLight ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)";
      ctx.fill();

      // Draw text
      ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
      ctx.fillStyle = textColor;
      ctx.fillText(label, 0, 1);
      ctx.restore();
    });

    // Center — clean white circle (no emoji)
    ctx.beginPath(); ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFFFF"; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(0,0,0,0.06)"; ctx.lineWidth = 1; ctx.stroke();

    // Pointer — tangerine triangle at top
    ctx.beginPath();
    ctx.moveTo(cx - 9, cy - r - 4); ctx.lineTo(cx + 9, cy - r - 4); ctx.lineTo(cx, cy - r + 10); ctx.closePath();
    ctx.fillStyle = "#FF5500"; ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    // Responsive: cap at 400px but shrink to fit container
    const container = canvas.parentElement;
    const maxW = container ? Math.min(620, container.clientWidth - 16) : 620;
    const size = Math.max(320, maxW);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    draw(angleRef.current);
  }, [countries]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true); setWinner(null);
    velocityRef.current = 0.28 + Math.random() * 0.14;
    const animate = () => {
      velocityRef.current *= 0.984;
      angleRef.current += velocityRef.current;
      draw(angleRef.current);
      if (velocityRef.current > 0.001) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        const segs = countriesRef.current, n = segs.length, seg = (2 * Math.PI) / n;
        const norm = ((angleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const offset = (((3 * Math.PI / 2) - norm) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const idx = Math.floor(offset / seg) % n;
        setWinner(segs[idx]);
        onResult(segs[idx]);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <canvas ref={canvasRef}
        style={{ cursor: spinning ? "default" : "pointer", display: "block", filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.1))", maxWidth: "100%" }}
        onClick={spin} />
      <button onClick={spin} disabled={spinning}
        style={{
          background: spinning ? "var(--noshd-border)" : "var(--noshd-tangerine)",
          color: spinning ? "var(--noshd-muted)" : "#FFFFFF",
          border: `2px solid ${spinning ? "var(--noshd-border)" : "var(--noshd-tangerine)"}`,
          borderRadius: "2px",
          padding: "13px 48px",
          fontSize: "15px",
          fontWeight: 700,
          cursor: spinning ? "not-allowed" : "pointer",
          textTransform: "lowercase",
          fontFamily: "var(--font-body)",
          transition: "all 0.2s",
          letterSpacing: "0.3px",
        }}>
        {spinning ? "spinning\u2026" : "spin the wheel"}
      </button>
      {winner && !spinning && (
        <div style={{ background: "var(--noshd-accent-bg)", border: "1px solid rgba(224,72,50,0.2)", borderRadius: "4px", padding: "14px 28px", textAlign: "center" }}>
          <div style={{ fontSize: "10px", color: "var(--noshd-muted)", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: "6px", fontFamily: "var(--font-body)" }}>tonight&apos;s cuisine</div>
          <div style={{ fontSize: "24px", fontWeight: 400, color: "var(--noshd-charcoal)", fontFamily: "var(--font-display)" }}>
            {COUNTRY_DATA[winner]?.flag} {winner}
          </div>
        </div>
      )}
    </div>
  );
}
