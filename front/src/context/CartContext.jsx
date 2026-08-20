import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("kasanteria-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("kasanteria-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    const qty = Number(quantity) || 1;
    const prodId = String(product.idproducts || product.id);

    const imgPath =
      product.image_path ||
      product.images?.find((i) => i.is_primary === 1)?.image_path ||
      product.images[0]?.image_path ||
      "";

    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => String(item.idproducts || item.id) === prodId,
      );

      if (existingProduct) {
        return prevCart.map((item) =>
          String(item.idproducts || item.id) === prodId
            ? { ...item, quantity: Number(item.quantity) + qty }
            : item,
        );
      } else {
        return [
          ...prevCart,
          { ...product, image_path: imgPath, quantity: qty },
        ];
      }
    });
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if ((item.idproducts || item.id) === productId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => (item.idproducts || item.id) !== productId),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
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
