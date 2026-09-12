import { create } from "zustand";

const useCartStore = create((set) => ({
  items: [],

  addToCart: (product) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item._id === product._id
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item._id === product._id
              ? {
                  ...item,
                  cartQuantity: item.cartQuantity + 1,
                }
              : item
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...product,
            cartQuantity: 1,
          },
        ],
      };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter(
        (item) => item._id !== productId
      ),
    })),

  increaseQuantity: (productId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item._id === productId
          ? {
              ...item,
              cartQuantity: item.cartQuantity + 1,
            }
          : item
      ),
    })),

  decreaseQuantity: (productId) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item._id === productId
            ? {
                ...item,
                cartQuantity: item.cartQuantity - 1,
              }
            : item
        )
        .filter((item) => item.cartQuantity > 0),
    })),

  clearCart: () => set({ items: [] }),
}));

export default useCartStore;