const api = "http://localhost:3000";

export const createProductWithImages = async (formData, token) => {
  const response = await fetch(`${api}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
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
  const response = await fetch(`${api}/products/${productid}`, {
    method: "PUT",
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
