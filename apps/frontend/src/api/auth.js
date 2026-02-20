import api from "./axios";

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    // Kembalikan seluruh response.data agar FE bisa akses token, valid, data, dsb
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};

export default authAPI;
