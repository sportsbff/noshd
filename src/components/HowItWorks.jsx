"use client";

const cards = [
  {
    title: "spin",
    desc: "let the wheel pick your next cuisine.",
    color: "var(--noshd-vermilion)",
    bgLight: "var(--noshd-vermilion-light)",
    num: "01",
  },
  {
    title: "discover",
    desc: "find restaurants vetted by locals.",
    color: "var(--noshd-cobalt)",
    bgLight: "var(--noshd-cobalt-light)",
    num: "02",
  },
  {
    title: "devour",
    desc: "order the must-try dish.",
    color: "var(--noshd-jade)",
    bgLight: "var(--noshd-jade-light)",
    num: "03",
  },
  {
    title: "save",
    desc: "stamp your passport.",
    color: "var(--noshd-saffron)",
    bgLight: "var(--noshd-saffron-light)",
    num: "04",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-5 py-12 md:px-8 md:py-16" style={{ background: "var(--noshd-grey-100)" }}>
      <div className="max-w-[960px] mx-auto">
        <p className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase mb-6 text-center"
          style={{ fontFamily: "var(--font-body)", color: "var(--noshd-grey-400)" }}>
          how it works
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {cards.map((card) => (
            <div key={card.title} className="relative rounded-lg p-5 md:p-6 transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "var(--noshd-white)", border: "1px solid var(--noshd-grey-200)" }}>
              <span className="block text-[0.6875rem] font-bold tracking-[0.08em] mb-3"
                style={{ color: card.color, fontFamily: "var(--font-body)" }}>
                {card.num}
              </span>
              <h3 className="text-lg md:text-xl mb-1.5" style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                color: "var(--noshd-ink)",
              }}>{card.title}</h3>
              <p className="text-[0.8125rem] leading-relaxed" style={{
                fontFamily: "var(--font-body)",
                color: "var(--noshd-grey-600)",
              }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
