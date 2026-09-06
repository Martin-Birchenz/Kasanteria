import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("punto_trama_cart");
      if (!savedCart) return [];
      const parsed = JSON.parse(savedCart);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    try {
      if (Array.isArray(cart)) {
        localStorage.setItem("punto_trama_cart", JSON.stringify(cart));
      }
    } catch (error) {
      console.error(error);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1, selectedColor = "") => {
    if (!product) return;

    const id = product.idproducts || product.id;
    const itemKey = selectedColor ? `${id}-${selectedColor}` : `${id}`;
    const qtyToAdd = Math.min(1, Number(quantity) || 1);
    const maxStock = Number(product.stock) || 0;

    setCart((prevCart) => {
      const currentCart = Array.isArray(prevCart) ? prevCart : [];
      const existingIndex = currentCart.findIndex(
        (item) => item.itemKey === itemKey,
      );
      if (existingIndex > -1) {
        return currentCart.map((item, idx) => {
          if (idx === existingIndex) {
            const nextQty = item.quantity + qtyToAdd;
            return {
              ...item,
              quantity: maxStock > 0 ? Math.min(maxStock, nextQty) : nextQty,
            };
          }
          return item;
        });
      }
      return [
        ...currentCart,
        {
          ...product,
          idproducts: id,
          itemKey,
          quantity: maxStock > 0 ? Math.min(maxStock, qtyToAdd) : qtyToAdd,
          selectedColor: selectedColor || "Único",
        },
      ];
    });
  };

  // const decreaseQuantity = (productId) => {
  //   setCart((prevCart) => {
  //     return prevCart
  //       .map((item) => {
  //         if ((item.idproducts || item.id) === productId) {
  //           return { ...item, quantity: item.quantity - 1 };
  //         }
  //         return item;
  //       })
  //       .filter((item) => item.quantity > 0);
  //   });
  // };

  const updateQuantity = (itemKey, newQuantity) => {
    const qty = Number(newQuantity);
    if (qty <= 0) {
      removeFromCart(itemKey);
      return;
    }

    setCart((prevCart) => {
      const currentCart = Array.isArray(prevCart) ? prevCart : [];
      return currentCart.map((item) => {
        if (item.itemKey === itemKey) {
          const maxStock = Number(item.stock) || qty;
          return {
            ...item,
            quantity: Math.min(maxStock, qty),
          };
        }
        return item;
      });
    });
  };

  const removeFromCart = (itemKey) => {
    setCart((prevCart) => {
      const currentCart = Array.isArray(prevCart) ? prevCart : [];
      return currentCart.filter((item) => item.itemKey !== itemKey);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const safeCart = Array.isArray(cart) ? cart : [];
  const totalItems = safeCart.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0,
  );
  const totalPrice = safeCart.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart: safeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe estar dentro de un CartProvider");
  }
  return context;
};
