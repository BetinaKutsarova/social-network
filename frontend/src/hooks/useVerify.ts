import { useAtom } from "jotai";
import { useState, useEffect, useCallback } from "react";
import { userAtom } from "../state/atoms";
import { api } from "../services/api";

export const useVerify = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(true);

  const verifyAuth = useCallback(async (): Promise<void> => {
    if (user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.get("/auth/verify");
      console.log("USER IN VERIFY AUTH", user);
      const userData = response.data.user;
      const token = response.data.user.token;
      console.log("RESPONSE IN VERIFY AUTH", response.data);
      // setUser(response.data.user);
      setUser({ ...userData, token });
    } catch (error) {
      console.error("Authentication error:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [user, setUser]);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    verifyAuth,
  };
};
