import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useFavoris } from "../context/FavorisContext";
import useProduits from "../hooks/useProduits";
import CarteProduit from "../components/CarteProduit";
import Spinner from "../components/Spinner";

export default function Favoris() {
  const { favoris } = useFavoris();
  const { produits, loading, error } = useProduits();

  const favorisProduits = useMemo(() => {
    return produits.filter((p) => favoris.includes(p.id));
  }, [produits, favoris]);

  return (
    <div className="bg-white px-5 py-16 lg:px-10 animate-page">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center animate-fade-up">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B]">Ma selection</p>
          <h1 className="mt-4 font-serif text-4xl font-normal uppercase tracking-[0.1em] text-[#1A1A1A]">
            Mes Favoris
          </h1>
        </div>

        {loading && <Spinner label="Chargement de vos favoris..." />}
        {error && <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        
        {!loading && !error && (
          <>
            {favorisProduits.length > 0 ? (
              <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favorisProduits.map((produit) => (
                  <CarteProduit key={produit.id} produit={produit} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center animate-fade-up">
                <p className="text-[#6B6B6B]">Vous n'avez pas encore de produits en favoris.</p>
                <Link to="/catalogue" className="btn-secondary mt-8 inline-block">
                  Decouvrir le catalogue
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
