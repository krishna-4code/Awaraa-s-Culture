"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CommerceCart, CommerceProduct, CommerceVariant } from '@/lib/commerce';
import { createCart, getCart, addToCart, updateCart, removeCartItem, clearCart as clearCommerceCart } from '@/lib/commerce/cart';

interface CartContextType {
  cart: CommerceCart | null;
  isLoading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    variantId: string,
    quantity?: number,
    openDrawer?: boolean,
    product?: CommerceProduct,
    variant?: CommerceVariant | { id: string; title: string; available?: boolean }
  ) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CommerceCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  const initCart = useCallback(async () => {
    try {
      const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') || 'default_cart' : 'default_cart';
      const existingCart = await getCart(cartId);
      if (existingCart) {
        setCart(existingCart);
      }
    } catch (e) {
      console.error("Failed to initialize cart", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initCart();

    // Sync across browser tabs if localStorage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'awaraa_cart_storage' || e.key === 'cartId') {
        initCart();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [initCart]);

  const addItem = async (
    variantId: string,
    quantity: number = 1,
    openDrawer: boolean = false,
    product?: CommerceProduct,
    variant?: CommerceVariant | { id: string; title: string; available?: boolean }
  ) => {
    setIsLoading(true);
    try {
      let currentCart = cart;
      if (!currentCart || currentCart.lines.length === 0) {
        currentCart = await createCart(variantId, quantity, product, variant);
        if (currentCart) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('cartId', currentCart.id);
          }
          setCart(currentCart);
        }
      } else {
        const updatedCart = await addToCart(currentCart.id, variantId, quantity, product, variant);
        if (updatedCart) {
          setCart(updatedCart);
        }
      }
      if (openDrawer) {
        setIsCartOpen(true);
      }
    } catch (e) {
      console.error("Failed to add item to cart", e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cart) return;
    setIsLoading(true);
    try {
      const updatedCart = await updateCart(cart.id, lineId, quantity);
      setCart(updatedCart);
    } catch (e) {
      console.error("Failed to update cart item", e);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    if (!cart) return;
    setIsLoading(true);
    try {
      const updatedCart = await removeCartItem(cart.id, lineId);
      setCart(updatedCart);
    } catch (e) {
      console.error("Failed to remove cart item", e);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!cart) return;
    setIsLoading(true);
    try {
      await clearCommerceCart(cart.id);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cartId');
      }
      setCart(null);
    } catch (e) {
      console.error("Failed to clear cart", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
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
