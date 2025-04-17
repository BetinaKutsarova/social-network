import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { activeSectionAtom, userAtom } from "../state/atoms";
import { api } from "../services/api";
import { PetData } from "../interfaces/profile";

export const useUserPets = (userId?: string) => {
  const [user] = useAtom(userAtom);
  const [activeSection] = useAtom(activeSectionAtom);
  const [pets, setPets] = useState<PetData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const targetUserId = userId || user?.id;
  
  const fetchPetsData = useCallback(async () => {
    if (!targetUserId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`pets/user/${targetUserId}`);
      setPets(response.data);
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError("Failed to load pets");
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId]);
  
  const refreshPets = useCallback(() => {
    fetchPetsData();
  }, [fetchPetsData]);
  
  useEffect(() => {
    if (activeSection === "pets" && targetUserId) {
      fetchPetsData();
    }
  }, [activeSection, targetUserId, fetchPetsData]);
  
  return {
    pets,
    isLoading,
    error,
    refreshPets
  };
};