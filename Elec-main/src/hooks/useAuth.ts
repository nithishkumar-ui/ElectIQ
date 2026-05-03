import { useAuthStore } from "../store/authStore";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const data = await api.auth.login({ email, password });
    setAuth(data.user, data.access_token);
    navigate("/dashboard");
  };

  const register = async (email: string, password: string, displayName: string, country = "US") => {
    const data = await api.auth.register({ email, password, display_name: displayName, country });
    setAuth(data.user, data.access_token);
    navigate("/dashboard");
  };

  const logout = () => {
    clearAuth();
    navigate("/");
  };

  return { user, token, isAuthenticated, login, register, logout };
}
