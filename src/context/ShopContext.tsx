'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  fabric: string;
  weaveType: string;
  borderType?: string;
  color: string;
  blouseColor?: string;
  lengthWithBlouse?: string;
  occasion?: string;
  images: string;
  rating?: number;
  reviewCount?: number;
  category?: { name: string; slug: string };
  isAuthenticCraft?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  stock?: number;
  isOutOfStock?: boolean;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  hasFallPico?: boolean;
  fallPicoPrice?: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: ProductItem[];
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  isCartOpen: boolean;
  addToCart: (product: ProductItem, options?: { hasFallPico?: boolean; fallPicoPrice?: number }) => void;
  removeFromCart: (productId: string, hasFallPico?: boolean) => void;
  updateQuantity: (productId: string, quantity: number, hasFallPico?: boolean) => void;
  clearCart: () => void;
  toggleWishlist: (product: ProductItem) => void;
  isInWishlist: (productId: string) => boolean;
  setIsCartOpen: (open: boolean) => void;
  totalCartPrice: number;
  totalOriginalPrice: number;
  totalDiscount: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<ProductItem[]>([]);
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('reoti_cart');
      const savedWishlist = localStorage.getItem('reoti_wishlist');
      const savedUser = localStorage.getItem('reoti_user');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedUser) setUserState(JSON.parse(savedUser));
    } catch (e) {
      console.error('Failed to load storage:', e);
    }
  }, []);

  // Track visitor session once per browser session
  useEffect(() => {
    try {
      const hasTracked = sessionStorage.getItem('reoti_tracked_session');
      if (!hasTracked) {
        sessionStorage.setItem('reoti_tracked_session', 'true');
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'VISIT',
            title: '🌐 New Website Visitor',
            details: `Visited Reoti Handloom Store (${window.location.pathname})`,
            pageUrl: window.location.pathname,
          }),
        }).catch(() => {});
      }
    } catch (e) {}
  }, []);

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('reoti_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('reoti_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('reoti_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('reoti_user');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addToCart = (product: ProductItem, options?: { hasFallPico?: boolean; fallPicoPrice?: number }) => {
    const hasFallPico = !!options?.hasFallPico;
    const fallPicoPrice = hasFallPico ? (options?.fallPicoPrice ?? 200) : 0;

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && !!item.hasFallPico === hasFallPico
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, { product, quantity: 1, hasFallPico, fallPicoPrice }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, hasFallPico?: boolean) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && !!item.hasFallPico === !!hasFallPico))
    );
  };

  const updateQuantity = (productId: string, quantity: number, hasFallPico?: boolean) => {
    if (quantity <= 0) {
      removeFromCart(productId, hasFallPico);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && !!item.hasFallPico === !!hasFallPico ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: ProductItem) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const totalCartPrice = cart.reduce(
    (acc, item) =>
      acc + (item.product.price + (item.hasFallPico ? (item.fallPicoPrice || 200) : 0)) * item.quantity,
    0
  );
  const totalOriginalPrice = cart.reduce(
    (acc, item) =>
      acc + (item.product.originalPrice + (item.hasFallPico ? (item.fallPicoPrice || 200) : 0)) * item.quantity,
    0
  );
  const totalDiscount = totalOriginalPrice - totalCartPrice;

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        user,
        setUser,
        logout,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        setIsCartOpen,
        totalCartPrice,
        totalOriginalPrice,
        totalDiscount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
