"use client";

import { CountUp } from "./CountUp";
import { MarkerUnderline } from "./MarkerUnderline";

export function Craft() {
  return (
    <section id="matrix" className="w-full bg-bright-card text-bright-ink py-24 px-6 relative overflow-hidden border-t border-bright-ink/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Section Header with MarkerUnderline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-bright-ink/10 pb-8">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold block mb-2">
              ✦ Transparency & Engineering
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-bright-ink">
              The Comfort{" "}
              <MarkerUnderline
                text="MATRIX"
                annotation="Verified Specs"
                strokeColor="#FF6B8B"
              />
            </h2>
          </div>
          <p className="font-sans text-base text-bright-muted max-w-md">
            Transparent breakdown of materials, sole construction, and design specifications.
          </p>
        </div>

        {/* CPG Spec & Craft Matrix Table */}
        <div className="cpg-card cpg-card-diecut !p-0 overflow-hidden border border-bright-ink/15 bg-white shadow-md">
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
                
                <tr className="hover:bg-bright-sun/10 transition-colors">
                  <td className="py-5 px-6 font-bold text-bright-ink">Cushioning & Midsole</td>
                  <td className="py-5 px-6 text-bright-ink font-medium">
                    Dual-Density EVA Foam Compound
                  </td>
                  <td className="py-5 px-6 text-right">
                    <span className="font-accent text-xs bg-bright-lime text-white px-3 py-1 rounded-full font-bold tracking-wider uppercase">
                      CONFIRMED SPEC
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-bright-sun/10 transition-colors">
                  <td className="py-5 px-6 font-bold text-bright-ink">Insole Ergonomics</td>
                  <td className="py-5 px-6 text-bright-ink font-medium">
                    Molded Arch Footbed for Urban Walking
                  </td>
                  <td className="py-5 px-6 text-right">
                    <span className="font-accent text-xs bg-bright-lime text-white px-3 py-1 rounded-full font-bold tracking-wider uppercase">
                      CONFIRMED SPEC
                    </span>
                  </td>
                </tr>

                {/* Count-Up Scroll-Triggered Animation for Numeric Spec 1 */}
                <tr className="hover:bg-bright-sun/10 transition-colors">
                  <td className="py-5 px-6 font-bold text-bright-ink">Wear-In Target</td>
                  <td className="py-5 px-6 text-bright-ink font-bold">
                    <CountUp end={0} suffix=" Days Break-In (Immediate)" />
                  </td>
                  <td className="py-5 px-6 text-right">
                    <span className="font-accent text-xs bg-bright-amber text-white px-3 py-1 rounded-full font-bold tracking-wider uppercase">
                      DESIGN TARGET
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-bright-sun/10 transition-colors">
                  <td className="py-5 px-6 font-bold text-bright-ink">Upper Construction</td>
                  <td className="py-5 px-6 text-bright-ink font-medium">
                    Breathable Canvas & Premium Suede
                  </td>
                  <td className="py-5 px-6 text-right">
                    <span className="font-accent text-xs bg-bright-card text-bright-muted px-3 py-1 rounded-full font-bold border border-bright-ink/10 tracking-wider uppercase">
                      IN TESTING
                    </span>
                  </td>
                </tr>

                {/* Count-Up Scroll-Triggered Animation for Numeric Spec 2 */}
                <tr className="hover:bg-bright-sun/10 transition-colors">
                  <td className="py-5 px-6 font-bold text-bright-ink">Sole Weight Benchmark</td>
                  <td className="py-5 px-6 text-bright-ink font-bold">
                    <CountUp end={320} suffix="g (Lightweight Target)" />
                  </td>
                  <td className="py-5 px-6 text-right">
                    <span className="font-accent text-xs bg-bright-card text-bright-muted px-3 py-1 rounded-full font-bold border border-bright-ink/10 tracking-wider uppercase">
                      IN TESTING
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-bright-sun/10 transition-colors">
                  <td className="py-5 px-6 font-bold text-bright-ink">Pricing Model</td>
                  <td className="py-5 px-6 text-bright-ink font-medium">
                    Direct-to-Consumer Transparent Pricing (No Hype Markup)
                  </td>
                  <td className="py-5 px-6 text-right">
                    <span className="font-accent text-xs bg-bright-lime text-white px-3 py-1 rounded-full font-bold tracking-wider uppercase">
                      CONFIRMED POLICY
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* CPG Brand Promise Footer Callout */}
        <div className="cpg-card bg-bright-amber text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="max-w-2xl text-left">
            <span className="font-accent text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">
              ✦ Honest Craft Promise
            </span>
            <h3 className="font-display font-extrabold text-2xl md:text-3xl mb-2">
              Comfort Before Trends. Quality Before Profit.
            </h3>
            <p className="font-sans text-sm text-white/90">
              We focus on honest daily comfort for Delhi NCR youth. No dark patterns, no artificial scarcity.
            </p>
          </div>
          <a
            href="#squad"
            className="bg-white text-bright-amber font-sans font-bold px-6 py-3.5 rounded-full hover:bg-bright-ink hover:text-white transition-all duration-200 shadow-md whitespace-nowrap"
          >
            Explore Squad Kicks ➔
          </a>
        </div>

      </div>
    </section>
  );
}
