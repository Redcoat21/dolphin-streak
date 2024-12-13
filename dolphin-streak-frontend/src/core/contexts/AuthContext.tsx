import { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthenticated: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Checking authentication status");
    let token = sessionStorage.getItem(
      "secure_dolphin_streak_usr_access_token"
    );
    if (!token) {
      token = localStorage.getItem(
        "secure_dolphin_streak_usr_access_token"
      );
    }
    console.log({ token, isAuthenticated });

    setAuthenticated(!!token);
    setLoading(false); // Set loading to false after checking the token
  }, []);

  if (loading) return null; // Prevent rendering until loading is complete

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
