import { api } from "./api";

export interface CreatePetData {
  name: string;
  species: string;
  breed?: string;
  ageYears?: number;
  bio?: string;
  avatarUrl?: string | null;
}

export const createPet = async (petData: CreatePetData) => {
  const response = await api.post("/pets", petData, {});
  return response.data;
};
