export const API_URL =
  import.meta.env.VITE_API_URL || "https://punto-and-trama.onrender.com";

export const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
  });
};

export const getProducts = async () => {
  try {
    const response = await authFetch("/products");
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener los productos", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await authFetch("/categories");
    if (!response.ok) {
      throw new Error("Error al obtener las categorías");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener las categorías", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  const res = await authFetch(`/products/${id}`);
  if (!res.ok) {
    throw new Error("Error al obtener el producto");
  }
  return res.json();
};

export const getFeatured = async () => {
  const res = await authFetch("/products/featured");
  if (!res.ok) {
    throw new Error("Error al obtener los productos destacados");
  }
  return res.json();
};

export const getSubcategories = async () => {
  const res = await authFetch("/subcategories");
  if (!res.ok) {
    throw new Error("Error al obtener las subcategorías");
  }
  return res.json();
};
