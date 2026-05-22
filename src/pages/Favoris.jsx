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
    <div className="min-h-screen bg-[#f7f4ef]">
      {/* Header */}
      <div className="border-b border-black/[0.05] bg-white px-5 py-12 text-center animate-fade-up">
        <p className="section-label mb-3">Ma sélection</p>
        <h1 className="section-title">
          Mes Favoris
          {favoris.length > 0 && (
            <span className="ml-3 align-middle text-[#c9a84c]">({favoris.length})</span>
          )}
        </h1>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 animate-page">
        {loading && <Spinner label="Chargement de vos favoris..." />}
        {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        {!loading && !error && (
          <>
            {favorisProduits.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favorisProduits.map((produit) => (
                  <CarteProduit key={produit.id} produit={produit} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-28 text-center animate-fade-up">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm text-4xl">
                  💛
                </div>
                <h2 className="font-serif text-2xl uppercase tracking-[0.1em] text-[#080808]">
                  Aucun favori pour l'instant
                </h2>
                <p className="mt-4 max-w-sm text-sm text-[#7a7368] leading-7">
                  Parcourez notre catalogue et cliquez sur le cœur pour sauvegarder vos pièces préférées.
                </p>
                <Link to="/catalogue" className="btn-primary mt-8 inline-flex">
                  Découvrir le catalogue
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
