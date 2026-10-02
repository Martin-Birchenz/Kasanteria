import { API_URL } from "../services/api.js";

export const createProductWithImages = async (formData, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers,
    credentials: "include",
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const updateProductWithImages = async (productId, formData, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers,
    credentials: "include",
    body: formData,
  });
  if (response.status === 401 || response.status === 403) {
    window.location.href = "/login";
    throw new Error("Sesión expirada. Por favor, iniciá sesión nuevamente.");
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const toggleProductsStatus = async (productId, currentStatus, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(`${API_URL}/products/${productId}/status`, {
    method: "PATCH",
    headers,
    credentials: "include",
    body: JSON.stringify({ is_active: currentStatus === 1 ? 0 : 1 }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const toggleFeaturedStatus = async (
  productId,
  currentFeatured,
  token,
) => {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${API_URL}/products/${productId}/featured`, {
    method: "PATCH",
    headers,
    credentials: "include",
    body: JSON.stringify({ is_featured: currentFeatured === 1 ? 0 : 1 }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const deleteProduct = async (productId, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};
