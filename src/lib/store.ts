import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  image_url: string
  quantity: number
}

export interface WishlistItem {
  id: string
  name: string
  slug: string
  price: number
  image_url: string
}

interface StoreState {
  // Cart
  items: CartItem[]
  addItem: (product: any, qty?: number) => boolean
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
  
  // Wishlist
  wishlist: WishlistItem[]
  setWishlist: (items: WishlistItem[]) => void
  toggleWishlist: (product: any) => void
  isInWishlist: (productId: string) => boolean
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart Implementation
      items: [],
      addItem: (product, qty = 1) => {
        const items = get().items
        const existingItem = items.find((item) => item.id === product.id)

        if (existingItem) {
          return false
        } else {
          set({ items: [...items, { 
            ...product, 
            price: product.promo_price || product.price,
            image_url: product.main_image || product.images?.[0] || "",
            quantity: qty 
          }] })
          return true
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),

      // Wishlist Implementation
      wishlist: [],
      setWishlist: (items) => set({ wishlist: items }),
      toggleWishlist: (product) => {
        const wishlist = get().wishlist
        const isFavorited = wishlist.some(item => item.id === product.id)
        
        if (isFavorited) {
          set({ wishlist: wishlist.filter(item => item.id !== product.id) })
        } else {
          set({ wishlist: [...wishlist, {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.promo_price || product.price,
            image_url: product.main_image || product.images?.[0] || ""
          }] })
        }
      },
      isInWishlist: (productId) => {
        return get().wishlist.some(item => item.id === productId)
      }
    }),
    {
      name: 'marketplace-storage',
    }
  )
)

// Backward compatibility (optional but recommended for less refactoring)
export const useCart = () => {
  const store = useStore()
  return {
    items: store.items,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    totalItems: store.totalItems,
    totalPrice: store.totalPrice,
  }
}

export const useWishlist = () => {
  const store = useStore()
  return {
    wishlist: store.wishlist,
    setWishlist: store.setWishlist,
    toggleWishlist: store.toggleWishlist,
    isInWishlist: store.isInWishlist,
  }
}

