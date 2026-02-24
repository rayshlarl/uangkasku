import api from "./axios";

export const transactionAPI = {
  getAll: async (params = {}) => {
    console.log("Hi");
    const response = await api.get("/transactions", { params });
    return response.data.data;
  },

  create: async (transactionData = {}) => {
    console.log("transactionData");
    const response = await api.post("/transactions", transactionData);
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
