const api = "http://localhost:3000";

export const createProductWithImages = async (formData, token) => {
  const response = await fetch(`${api}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
      Authorization: `Bearer ${token}`,
    },
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
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};
