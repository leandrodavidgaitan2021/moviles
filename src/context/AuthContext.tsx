// src/context/AuthContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
  user: string | null;
  isAuthenticated: boolean;
  cargando: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  // Al iniciar la app, verificamos si hay una sesión guardada en AsyncStorage
  useEffect(() => {
    async function verificarSesion() {
      try {
        const token = await AsyncStorage.getItem("@user_session");
        if (token) {
          setUser(token);
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
      } finally {
        setCargando(false);
      }
    }
    verificarSesion();
  }, []);

  const login = async (email: string) => {
    try {
      await AsyncStorage.setItem("@user_session", email);
      setUser(email);
    } catch (error) {
      console.error("Error al guardar la sesión:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("@user_session");
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        cargando,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
