import api from "./axios";

export const karyawanApi = {
  getAll: async () => {
    const response = await api.get("/karyawan");
    return response.data;
  },
};
