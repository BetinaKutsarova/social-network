import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAtom } from "jotai";
import { isAuthenticatedAtom, userAtom } from "../state/atoms";

export const useLogout = () => {
  const navigate = useNavigate();
  const [, setUser] = useAtom(userAtom);
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      setUser(null);
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  return { logout };
};
