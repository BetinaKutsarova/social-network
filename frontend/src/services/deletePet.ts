import { api } from "./api";

export const deletePet = async (petId: string) => {
	const response = await api.delete(`/pets/${petId}`);
	return response.data;
};