import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CarteProduit from "../components/CarteProduit";
import Spinner from "../components/Spinner";
import useProduits from "../hooks/useProduits";

const categories = ["tous", "robes", "t-shirts", "pantalons", "vestes"];

export default function Catalogue() {
  const { produits, loading, error } = useProduits();
  const [searchParams, setSearchParams] = useSearchParams();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const activeCategory = searchParams.get("categorie") || "tous";

  const filteredProducts = useMemo(() => {
    return produits.filter((produit) => {
      const matchCategory = activeCategory === "tous" || produit.categorie === activeCategory;
      const matchMin = minPrice === "" || produit.prix >= Number(minPrice);
      const matchMax = maxPrice === "" || produit.prix <= Number(maxPrice);
      return matchCategory && matchMin && matchMax;
    });
  }, [produits, activeCategory, minPrice, maxPrice]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-or">Catalogue</p>
        <h1 className="section-title">Toute la collection</h1>
        <p className="max-w-2xl text-white/70">
          Filtrez les vêtements par catégorie et budget pour trouver rapidement la bonne pièce.
        </p>
      </div>

      <section className="card-surface space-y-6 p-6">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSearchParams(category === "tous" ? {} : { categorie: category })}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeCategory === category
                  ? "bg-or text-black"
                  : "border border-white/15 bg-white/5 text-white/70 hover:border-or hover:text-or"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-white/70">Prix minimum (DA)</span>
            <input
              type="number"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              className="input-base"
              placeholder="0"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-white/70">Prix maximum (DA)</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              className="input-base"
              placeholder="100000"
            />
          </label>
        </div>
      </section>

      {loading && <Spinner label="Chargement du catalogue..." />}
      {error && <p className="rounded-3xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</p>}

      {!loading && !error && (
        <>
          <p className="text-sm text-white/60">{filteredProducts.length} produit(s) trouvé(s).</p>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((produit) => (
              <CarteProduit key={produit.id} produit={produit} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
