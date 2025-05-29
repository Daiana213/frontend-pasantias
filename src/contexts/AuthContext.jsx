import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Cambiado de false a null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user); // No modificar el rol/tipo aquí
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
