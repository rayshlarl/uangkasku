import api from "./axios";

export const transactionAPI = {
  // Note: sementara credents ane hapus.
  // masih mikir logic buat paginationya
  getAll: async () => {
    const response = await api.get("/transactions");
    return response.data.data;
  },

  //ane tambahin "/create" biar ga nabrak route atas
  create: async (transactionData) => {
    const response = await api.post("/transactions/create", transactionData);
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
