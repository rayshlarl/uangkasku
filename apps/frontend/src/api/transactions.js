import api from "./axios";

export const transactionAPI = {
  getAll: async (page, limit) => {
    const response = await api.get(`/transactions?page=${page}&limit=${limit}`);
    return response.data.data;
  },
  summarize: async () => {
    const response = await api.get("/transactions/summarize");
    return response.data.data;
  },
  getAllMyTrans: async (page, limit) => {
    const response = await api.get(
      `/transactions/profile?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },
  create: async (transactionData) => {
    const response = await api.post(
      "/transactions/createTrans",
      transactionData
    );
    return response.data.data;
  },

  update: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};

export default transactionAPI;
