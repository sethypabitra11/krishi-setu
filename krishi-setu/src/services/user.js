import api from "./api";

export const getUserProfile = async (token) => {
  const response = await api.get("/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};