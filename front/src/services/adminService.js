const api = "http://localhost:3000";

export const createProductWithImages = async (formData, token) => {
  const response = await fetch(`${api}/products`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const toggleProductsStatus = async (productid, currentStatus, token) => {
  const response = await fetch(`${api}/products/${productid}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ is_active: currentStatus === 1 ? 0 : 1 }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const deleteProduct = async (productId, token) => {
  const response = await fetch(`${api}/products/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};
