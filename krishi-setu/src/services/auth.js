import api from "./api";

export const signupUser = async (userData) => {
  const response = await api.post("/auth/signup", userData);

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);

  return response.data;
};

export const verifyAadhaar = async (aadhaarNumber) => {
  const response = await api.post("/verification/aadhaar", {
    aadhaarNumber,
  });

  return response.data;
};