import Link from "next/link";
import Image from "next/image";
import { getCollection } from "@/lib/commerce";

export async function Collection() {
  const categories = await getCollection();

  return (
    <section className="w-full bg-charcoal text-dust py-32 px-8 md:px-24">
      <h2 className="font-display text-4xl uppercase tracking-widest mb-24 border-b border-umber pb-4">
        Curated Selection
      </h2>
      
      <div className="flex flex-col gap-32">
        {categories.map((cat, i) => (
          <div key={cat.id} className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-24 items-center`}>
            
            {/* Image Placeholder */}
            <div className="w-full md:w-1/2 aspect-[4/5] bg-umber relative group overflow-hidden rounded-2xl">
              <Image 
                src={cat.imageUrl} 
                alt={`${cat.title} category`} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />
            </div>
            
            {/* Text & CTA */}
            <div className="w-full md:w-1/2 flex flex-col items-start gap-6">
              <span className="text-clay font-sans text-sm tracking-widest uppercase">0{i + 1}</span>
              <h3 className="font-display text-5xl md:text-7xl uppercase">{cat.title}</h3>
              <p className="font-sans text-xl text-sand max-w-md">{cat.description}</p>
              
              <Link 
                href={`/products/${cat.handle}`}
                className="mt-8 font-sans uppercase tracking-widest text-sm border-b border-dust pb-1 hover:text-clay hover:border-clay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
              >
                View Collection
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
