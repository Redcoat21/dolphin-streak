import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useAuthStore } from "../stores/authStore";

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthenticated: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    setLoading(false);
  }, [checkAuth]);


  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated: () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}
