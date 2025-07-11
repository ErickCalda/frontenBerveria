import React, { useEffect, useState } from "react";
import { verify } from "../service/authService";
import { getAccessToken } from "../utils/tokenStorage";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      console.log("No hay token guardado, no verificamos usuario");
      setChecking(false);
      return;
    }
    verify()
      .then(data => {
        if (data && data.usuario) {
          setUser(data.usuario);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        console.log("Token inválido o expirado");
        setUser(null);
      })
      .finally(() => {
        setChecking(false);
      });

      
  }, []);
  
  // Mostrar loading o algo mientras verificamos
  if (checking) return <div>Cargando...</div>;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
