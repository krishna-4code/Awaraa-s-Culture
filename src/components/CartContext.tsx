"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { CommerceCart, CommerceProduct, CommerceVariant } from '@/lib/commerce';
import { createCart, getCart, addToCart, updateCart, removeCartItem, clearCart as clearCommerceCart } from '@/lib/commerce/cart';

const PROMO_STORAGE_KEY = 'awaraa_promo_code';

interface PromoResult {
  success: boolean;
  error?: string;
}

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
  // Global promo code management
  appliedPromo: string | null;
  applyPromo: (code: string) => PromoResult;
  removePromo: () => void;
  rawSubtotal: number;
  discountAmount: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CommerceCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

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

      // Initialize persistent promo code
      if (typeof window !== 'undefined') {
        const storedPromo = localStorage.getItem(PROMO_STORAGE_KEY);
        if (storedPromo && (storedPromo.toUpperCase() === 'AWARAA10' || storedPromo.toUpperCase() === 'SQUAD10')) {
          setAppliedPromo(storedPromo.toUpperCase());
        }
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
      if (e.key === PROMO_STORAGE_KEY) {
        const newPromo = e.newValue;
        if (newPromo && (newPromo.toUpperCase() === 'AWARAA10' || newPromo.toUpperCase() === 'SQUAD10')) {
          setAppliedPromo(newPromo.toUpperCase());
        } else {
          setAppliedPromo(null);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [initCart]);

  const rawSubtotal = useMemo(() => {
    if (!cart?.cost?.subtotalAmount?.amount) return 0;
    return parseFloat(cart.cost.subtotalAmount.amount.replace(/,/g, '')) || 0;
  }, [cart]);

  const discountAmount = useMemo(() => {
    return appliedPromo ? Math.round(rawSubtotal * 0.1) : 0;
  }, [appliedPromo, rawSubtotal]);

  const finalTotal = useMemo(() => {
    return Math.max(0, rawSubtotal - discountAmount);
  }, [rawSubtotal, discountAmount]);

  const applyPromo = useCallback((code: string): PromoResult => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, error: 'Please enter a coupon code.' };
    }

    if (cleanCode === 'AWARAA10' || cleanCode === 'SQUAD10') {
      setAppliedPromo(cleanCode);
      if (typeof window !== 'undefined') {
        localStorage.setItem(PROMO_STORAGE_KEY, cleanCode);
      }
      return { success: true };
    }

    return { success: false, error: "Invalid code. Try 'AWARAA10'" };
  }, []);

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  }, []);

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
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
      setAppliedPromo(null);
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
        appliedPromo,
        applyPromo,
        removePromo,
        rawSubtotal,
        discountAmount,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

const defaultCartContext: CartContextType = {
  cart: null,
  isLoading: false,
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  addItem: async () => {},
  updateItem: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
  appliedPromo: null,
  applyPromo: () => ({ success: false, error: 'Cart not initialized' }),
  removePromo: () => {},
  rawSubtotal: 0,
  discountAmount: 0,
  finalTotal: 0,
};

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    return defaultCartContext;
  }
  return context;
}

