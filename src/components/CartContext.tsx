"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CommerceCart } from '@/lib/commerce';
import { createCart, getCart, addToCart, updateCart } from '@/lib/commerce/cart';

interface CartContextType {
  cart: CommerceCart | null;
  isLoading: boolean;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CommerceCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initCart = async () => {
      try {
        const cartId = localStorage.getItem('cartId');
        if (cartId) {
          const existingCart = await getCart(cartId);
          if (existingCart) {
            setCart(existingCart);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to initialize cart", e);
      }
      setIsLoading(false);
    };

    initCart();
  }, []);

  const addItem = async (variantId: string, quantity: number) => {
    setIsLoading(true);
    let currentCart = cart;
    
    if (!currentCart) {
      currentCart = await createCart(variantId, quantity);
      if (currentCart) {
        localStorage.setItem('cartId', currentCart.id);
        setCart(currentCart);
      }
    } else {
      const updatedCart = await addToCart(currentCart.id, variantId, quantity);
      if (updatedCart) setCart(updatedCart);
    }
    setIsLoading(false);
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cart) return;
    setIsLoading(true);
    const updatedCart = await updateCart(cart.id, lineId, quantity);
    if (updatedCart) setCart(updatedCart);
    setIsLoading(false);
  };

  return (
    <CartContext.Provider value={{ cart, isLoading, addItem, updateItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
