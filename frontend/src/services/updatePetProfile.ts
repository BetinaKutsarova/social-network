import { api } from "./api";
import { PetData } from "../interfaces/profile";

export const updatePetProfile = async (id: string, petData: PetData) => {
  const response = await api.put(`/pets/${id}`, petData, {});
  return response.data;
};
