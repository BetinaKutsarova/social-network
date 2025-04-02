import { api } from './api';
import { UpdateUserData } from '../interfaces/form';

export const updateUserProfile = async (userId: string, userData: UpdateUserData) => {
  const response = await api.put(`/users/${userId}`, userData, {
  });
  return response.data;
};
