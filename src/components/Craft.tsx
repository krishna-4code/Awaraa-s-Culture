"use client";

import { CountUp } from "./CountUp";
import { MarkerUnderline } from "./MarkerUnderline";

export function Craft() {
  const specs = [
    {
      id: "cushioning",
      name: "Cushioning & Midsole",
      target: "Dual-Density EVA Foam Compound",
      status: "CONFIRMED SPEC",
      statusStyle: "bg-bright-lime text-white",
    },
    {
      id: "insole",
      name: "Insole Ergonomics",
      target: "Molded Arch Footbed for Urban Walking",
      status: "CONFIRMED SPEC",
      statusStyle: "bg-bright-lime text-white",
    },
    {
      id: "breakin",
      name: "Wear-In Target",
      target: <CountUp end={0} suffix=" Days Break-In (Immediate)" />,
      status: "DESIGN TARGET",
      statusStyle: "bg-bright-amber text-white",
    },
    {
      id: "upper",
      name: "Upper Construction",
      target: "Breathable Canvas & Premium Suede",
      status: "IN TESTING",
      statusStyle: "bg-bright-card text-bright-muted border border-bright-ink/10",
    },
    {
      id: "weight",
      name: "Sole Weight Benchmark",
      target: <CountUp end={320} suffix="g (Lightweight Target)" />,
      status: "IN TESTING",
      statusStyle: "bg-bright-card text-bright-muted border border-bright-ink/10",
    },
    {
      id: "pricing",
      name: "Pricing Model",
      target: "Direct-to-Consumer Transparent Pricing (No Hype Markup)",
      status: "CONFIRMED POLICY",
      statusStyle: "bg-bright-lime text-white",
    },
  ];

  return (
    <section id="matrix" className="w-full bg-bright-card text-bright-ink py-12 sm:py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden border-t border-bright-ink/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 sm:gap-16">
        
        {/* Section Header with MarkerUnderline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-bright-ink/10 pb-8">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold block mb-2">
              ✦ Transparency & Engineering
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight text-bright-ink leading-tight">
              The Comfort{" "}
              <MarkerUnderline
                text="MATRIX"
                strokeColor="#FF6B8B"
              />
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-bright-muted max-w-md">
            Transparent breakdown of materials, sole construction, and design specifications.
          </p>
        </div>

        {/* Mobile Spec Cards View (visible on small screens < md) */}
        <div className="flex flex-col gap-3.5 md:hidden">
          {specs.map((spec) => (
            <div
              key={spec.id}
              className="bg-white rounded-xl p-4 border border-bright-ink/15 shadow-sm flex flex-col gap-2.5 transition-all"
            >
              <div className="flex items-start justify-between gap-2 border-b border-bright-ink/10 pb-2">
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-bright-ink/80">
                  {spec.name}
                </span>
                <span
                  className={`font-accent text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wider uppercase whitespace-nowrap shrink-0 ${spec.statusStyle}`}
                >
                  {spec.status}
                </span>
              </div>
              <div className="font-sans text-sm font-semibold text-bright-ink">
                {spec.target}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop CPG Spec & Craft Matrix Table (visible on medium screens & up >= md) */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-bright-ink/15 bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bright-ink text-white font-sans text-xs uppercase tracking-widest border-b border-bright-ink">
                  <th className="py-4 px-6 font-bold">Design & Craft Spec</th>
                  <th className="py-4 px-6 font-bold">Awaraa Specification Target</th>
                  <th className="py-4 px-6 font-bold text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bright-ink/10 font-sans text-sm">
                {specs.map((spec) => (
                  <tr key={spec.id} className="hover:bg-bright-sun/10 transition-colors">
                    <td className="py-5 px-6 font-bold text-bright-ink">{spec.name}</td>
                    <td className="py-5 px-6 text-bright-ink font-medium">{spec.target}</td>
                    <td className="py-5 px-6 text-right">
                      <span
                        className={`font-accent text-xs px-3 py-1 rounded-full font-bold tracking-wider uppercase ${spec.statusStyle}`}
                      >
                        {spec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CPG Brand Promise Footer Callout */}
        <div className="cpg-card bg-bright-amber text-white p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="max-w-2xl text-left w-full">
            <span className="font-accent text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">
              ✦ Honest Craft Promise
            </span>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl mb-2 leading-snug">
              Comfort Before Trends. Quality Before Profit.
            </h3>
            <p className="font-sans text-xs sm:text-sm text-white/90">
              We focus on honest daily comfort for Delhi NCR youth. No dark patterns, no artificial scarcity.
            </p>
          </div>
          <a
            href="#squad"
            className="bg-white text-bright-amber font-sans font-bold px-6 py-3.5 rounded-full hover:bg-bright-ink hover:text-white transition-all duration-200 shadow-md whitespace-nowrap w-full md:w-auto text-center"
          >
            Explore Squad Kicks ➔
          </a>
        </div>

      </div>
    </section>
  );
}
