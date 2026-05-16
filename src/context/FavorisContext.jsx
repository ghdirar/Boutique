import { createContext, useContext, useEffect, useState } from "react";

const FavorisContext = createContext();

export function FavorisProvider({ children }) {
  const [favoris, setFavoris] = useState(() => {
    const saved = localStorage.getItem("magsin-favoris");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("magsin-favoris", JSON.stringify(favoris));
  }, [favoris]);

  const toggleFavori = (produitId) => {
    setFavoris((current) =>
      current.includes(produitId) ? current.filter((id) => id !== produitId) : [...current, produitId],
    );
  };

  const isFavori = (produitId) => favoris.includes(produitId);

  return (
    <FavorisContext.Provider value={{ favoris, toggleFavori, isFavori }}>
      {children}
    </FavorisContext.Provider>
  );
}

export function useFavoris() {
  const context = useContext(FavorisContext);
  if (!context) {
    throw new Error("useFavoris must be used within a FavorisProvider");
  }
  return context;
}
