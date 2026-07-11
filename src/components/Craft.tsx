import { Placeholder } from "@/components/Placeholder";

export function Craft() {
  return (
    <section className="w-full min-h-[80vh] bg-charcoal text-sand py-24 px-8 md:px-24 border-t border-umber flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wide text-dust mb-16 text-center">
          Honest Craft, No Illusions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col gap-6">
            <h3 className="font-sans text-sm uppercase tracking-widest text-clay border-b border-umber pb-2">
              Our Sourcing Model
            </h3>
            <p className="font-sans text-lg leading-relaxed">
              We don't own factories or pretend to stitch every sole by hand. We are curators first. 
              We partner with trusted, established wholesalers to select footwear that meets a strict 
              standard for durability, daily comfort, and quiet confidence. Premium shouldn't require a markup.
            </p>
          </div>
          
          <div className="flex flex-col gap-6">
            <h3 className="font-sans text-sm uppercase tracking-widest text-clay border-b border-umber pb-2">
              The Standard
            </h3>
            <ul className="font-sans text-lg space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-clay mt-1">✓</span>
                <Placeholder text="TO CONFIRM: Specific material check e.g. Top-grain leather inspection" />
              </li>
              <li className="flex items-start gap-3">
                <span className="text-clay mt-1">✓</span>
                <Placeholder text="TO CONFIRM: Sole durability/flexibility requirement" />
              </li>
              <li className="flex items-start gap-3">
                <span className="text-clay mt-1">✓</span>
                <Placeholder text="TO CONFIRM: Internal cushioning standard" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
