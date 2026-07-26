"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { cart, isLoading, updateItem } = useCart();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-charcoal text-dust flex flex-col font-sans pt-12 pb-32">
        <div className="max-w-4xl mx-auto w-full px-8 md:px-0 flex flex-col gap-12">
          <h1 className="font-display text-4xl md:text-6xl uppercase tracking-widest text-dust">
            Your Cart
          </h1>
          <div className="w-full text-center text-sand py-20 uppercase tracking-widest">
            Loading...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-charcoal text-dust flex flex-col font-sans pt-12 pb-32">
      <div className="max-w-4xl mx-auto w-full px-8 md:px-0 flex flex-col gap-12">
        <h1 className="font-display text-4xl md:text-6xl uppercase tracking-widest text-dust">
          Your Cart
        </h1>
        
        {(!cart || cart.lines.length === 0) ? (
          <div className="w-full border-t border-umber/30 pt-16 flex flex-col items-center gap-6">
            <p className="text-sand text-lg uppercase tracking-widest">Your cart is empty</p>
            <Link 
              href="/collections"
              className="mt-4 font-sans uppercase tracking-widest text-sm border-b border-dust pb-1 hover:text-clay hover:border-clay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <>
            <div className="w-full border-t border-umber/30 pt-8 flex flex-col gap-8">
              {cart.lines.map((line) => (
                <div key={line.id} className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center w-full pb-8 border-b border-umber/10">
                  <div className="w-32 h-40 bg-umber flex-shrink-0 relative rounded-2xl overflow-hidden">
                    <Image src={line.merchandise.product.images?.[0]?.url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"} alt={line.merchandise.product.name} fill sizes="(max-width: 768px) 100px, 128px" className="object-cover" />
                  </div>
                  
                  <div className="flex-grow flex flex-col gap-2">
                    <h3 className="font-display text-2xl uppercase">{line.merchandise.product.name}</h3>
                    <p className="text-sand text-sm uppercase tracking-widest">Variant: {line.merchandise.title}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <button 
                        onClick={() => updateItem(line.id, line.quantity - 1)}
                        className="text-sand hover:text-clay transition-colors p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
                      >-</button>
                      <span className="w-4 text-center">{line.quantity}</span>
                      <button 
                        onClick={() => updateItem(line.id, line.quantity + 1)}
                        className="text-sand hover:text-clay transition-colors p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
                      >+</button>
                    </div>
                  </div>
                  
                  <div className="font-sans text-xl">
                    {/* Assuming we aren't fetching line item price yet from shopify in cart payload, fallback to total divided if necessary, or just skip it and rely on subtotal */}
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full flex flex-col items-end gap-6 pt-8">
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <div className="flex justify-between items-center text-sand">
                  <span className="uppercase tracking-widest text-sm">Subtotal</span>
                  <span className="text-lg">{cart.cost.subtotalAmount.currencyCode} {cart.cost.subtotalAmount.amount}</span>
                </div>
                <div className="flex justify-between items-center text-sand">
                  <span className="uppercase tracking-widest text-sm">Shipping</span>
                  <span className="text-sm">Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-center text-dust border-t border-umber/30 pt-4 mt-2">
                  <span className="uppercase tracking-widest text-sm font-bold">Estimated Total</span>
                  <span className="text-2xl font-bold">{cart.cost.totalAmount.currencyCode} {cart.cost.totalAmount.amount}</span>
                </div>

                <a 
                  href={cart.checkoutUrl}
                  className="w-full mt-8 py-5 bg-clay text-dust text-center font-display uppercase tracking-widest text-lg hover:scale-[1.02] transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal shadow-lg shadow-clay/20 rounded-xl"
                >
                  Checkout
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
