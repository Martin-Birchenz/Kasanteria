const API_URL = "http://localhost:3000";

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
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
    const response = await fetch(`${API_URL}/categories`);
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
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) {
    throw new Error("Error al obtener el producto");
  }
  return res.json();
};

export const getFeatured = async () => {
  const res = await fetch(`${API_URL}/products/featured`);
  if (!res.ok) {
    throw new Error("Error al obtener los productos destacados");
  }
  return res.json();
};

export const getSubcategories = async () => {
  const res = await fetch(`${API_URL}/subcategories`);
  if (!res.ok) {
    throw new Error("Error al obtener las subcategorías");
  }
  return res.json();
};
