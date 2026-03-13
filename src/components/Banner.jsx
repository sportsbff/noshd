"use client";

export default function Banner() {
  return (
    <section className="relative overflow-hidden text-center" style={{
      padding: "var(--space-2xl) var(--space-xl)",
      backgroundColor: "var(--noshd-charcoal)",
      color: "var(--noshd-white)",
    }}>
      <svg className="absolute pointer-events-none opacity-10 top-[20%] left-[5%]" width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="10" cy="10" r="4" fill="var(--noshd-vermilion)"/>
        <circle cx="40" cy="20" r="3" fill="var(--noshd-cobalt)"/>
        <circle cx="15" cy="50" r="5" fill="var(--noshd-saffron)"/>
        <circle cx="60" cy="40" r="3" fill="var(--noshd-jade)"/>
        <circle cx="30" cy="70" r="4" fill="var(--noshd-vermilion)"/>
      </svg>
      <svg className="absolute pointer-events-none opacity-10 bottom-[15%] right-[8%]" width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="70" cy="15" r="5" fill="var(--noshd-saffron)"/>
        <circle cx="30" cy="30" r="3" fill="var(--noshd-jade)"/>
        <circle cx="60" cy="55" r="4" fill="var(--noshd-cobalt)"/>
        <circle cx="20" cy="65" r="3" fill="var(--noshd-vermilion)"/>
      </svg>
      <p className="relative z-[2] max-w-[640px] mx-auto" style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
        fontWeight: 400,
        lineHeight: 1.35,
      }}>
        195 countries. Thousands of restaurants. All hiding in{" "}
        <span className="relative" style={{ color: "var(--noshd-saffron)" }}>
          your city
          <span className="absolute -top-2 -left-2.5 -right-2.5 -bottom-1.5 border-[2.5px] rounded-[50%_45%_55%_40%] opacity-35 -rotate-2" style={{ borderColor: "var(--noshd-saffron)" }}/>
        </span>.
      </p>
    </section>
  );
}
