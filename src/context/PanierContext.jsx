import { createContext, useContext, useEffect, useMemo, useState } from "react";

const PanierContext = createContext(null);
const STORAGE_KEY = "magsin-panier-firebase";

export function PanierProvider({ children }) {
  const [articles, setArticles] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  const ajouterAuPanier = (article) => {
    setArticles((currentArticles) => {
      const existingIndex = currentArticles.findIndex(
        (item) =>
          item.produitId === article.produitId &&
          item.taille === article.taille &&
          item.couleur === article.couleur,
      );

      if (existingIndex === -1) {
        return [...currentArticles, article];
      }

      return currentArticles.map((item, index) =>
        index === existingIndex
          ? { ...item, quantite: item.quantite + article.quantite }
          : item,
      );
    });
  };

  const modifierQuantite = (index, quantite) => {
    if (quantite <= 0) {
      supprimerArticle(index);
      return;
    }

    setArticles((currentArticles) =>
      currentArticles.map((item, itemIndex) =>
        itemIndex === index ? { ...item, quantite } : item,
      ),
    );
  };

  const supprimerArticle = (index) => {
    setArticles((currentArticles) => currentArticles.filter((_, itemIndex) => itemIndex !== index));
  };

  const viderPanier = () => {
    setArticles([]);
  };

  const total = articles.reduce((sum, article) => sum + article.prix * article.quantite, 0);
  const nombreArticles = articles.reduce((sum, article) => sum + article.quantite, 0);

  const value = useMemo(
    () => ({
      articles,
      total,
      nombreArticles,
      ajouterAuPanier,
      modifierQuantite,
      supprimerArticle,
      viderPanier,
    }),
    [articles, total, nombreArticles],
  );

  return <PanierContext.Provider value={value}>{children}</PanierContext.Provider>;
}

export function usePanier() {
  const context = useContext(PanierContext);

  if (!context) {
    throw new Error("usePanier doit etre utilise dans PanierProvider.");
  }

  return context;
}
