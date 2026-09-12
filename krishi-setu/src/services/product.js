import api from "./api";

export const addProduct = async (productData, token) => {
  const response = await api.post("/products", productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMyProducts = async (token) => {
  const response = await api.get("/products/my-products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteProduct = async (productId, token) => {
  const response = await api.delete(`/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getProducts = async (token) => {
  const response = await api.get("/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};