import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState(null); // Cambiado de false a null
  const [loading, setLoading] = useState(true);

  // Función para actualizar el usuario y guardarlo en localStorage
  const setCurrentUser = useCallback((user) => {
    if (user) {
      localStorage.setItem('usuario', JSON.stringify(user));
    }
    setCurrentUserState(user);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUserState(user); // No modificar el rol/tipo aquí
      } catch (error) {
        console.error('Error al parsear usuario almacenado:', error);
        localStorage.removeItem('usuario'); // Eliminar datos corruptos
      }
    }
    setLoading(false);
  }, []);

  const value = { currentUser, loading, setCurrentUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
