import api from "./api";

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getCart = async (token) => {
  const response = await api.get(
    "/cart",
    getAuthHeaders(token)
  );

  return response.data;
};

export const addCartItem = async (
  productId,
  quantity,
  token
) => {
  const response = await api.post(
    "/cart",
    {
      productId,
      quantity,
    },
    getAuthHeaders(token)
  );

  return response.data;
};

export const updateCartItem = async (
  productId,
  quantity,
  token
) => {
  const response = await api.put(
    "/cart",
    {
      productId,
      quantity,
    },
    getAuthHeaders(token)
  );

  return response.data;
};

export const removeCartItem = async (
  productId,
  token
) => {
  const response = await api.delete(
    `/cart/${productId}`,
    getAuthHeaders(token)
  );

  return response.data;
};

export const clearCartItems = async (token) => {
  const response = await api.delete(
    "/cart",
    getAuthHeaders(token)
  );

  return response.data;
};