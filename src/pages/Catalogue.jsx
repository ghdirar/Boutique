import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CarteProduit from "../components/CarteProduit";
import Spinner from "../components/Spinner";
import useProduits from "../hooks/useProduits";

const categories = ["sacs-main"];

export default function Catalogue() {
  const { produits, loading, error } = useProduits();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("nouveautes");
  
  const activeCategory = searchParams.get("categorie") || "";
  const searchQuery = searchParams.get("q") || "";
  
  // Multiple colors selection logic
  const activeColors = useMemo(() => {
    const val = searchParams.get("couleurs");
    return val ? val.split(",") : [];
  }, [searchParams]);

  // Price filtering state (0 to 10000 as requested)
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  // Extract real colors from products
  const availableColors = useMemo(() => {
    const colorSet = new Set();
    produits.forEach(p => {
      if (Array.isArray(p.couleurs)) {
        p.couleurs.forEach(c => {
          if (typeof c === 'object' && c.hex) colorSet.add(c.hex);
          else if (typeof c === 'string') colorSet.add(c);
        });
      }
    });
    return Array.from(colorSet);
  }, [produits]);

  const toggleColor = (color) => {
    const next = new URLSearchParams(searchParams);
    let currentColors = activeColors;
    
    if (currentColors.includes(color)) {
      currentColors = currentColors.filter(c => c !== color);
    } else {
      currentColors = [...currentColors, color];
    }

    if (currentColors.length > 0) {
      next.set("couleurs", currentColors.join(","));
    } else {
      next.delete("couleurs");
    }
    setSearchParams(next);
  };

  const updateCategory = (category) => {
    const next = new URLSearchParams(searchParams);
    if (next.get("categorie") === category) {
      next.delete("categorie");
    } else {
      next.set("categorie", category);
    }
    setSearchParams(next);
  };

  const filteredProducts = useMemo(() => {
    return produits
      .filter((p) => {
        const matchesCategory = !activeCategory || p.categorie === activeCategory;
        const matchesSearch = !searchQuery || p.nom.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Corrected price filtering (Range [min, max])
        const price = Number(p.prix);
        const matchesPrice = price >= minPrice && price <= maxPrice;
        
        const productColors = Array.isArray(p.couleurs) 
          ? p.couleurs.map(c => typeof c === 'object' ? c.hex : c)
          : [];
        
        // Multiple colors matching (OR logic)
        const matchesColor = activeColors.length === 0 || activeColors.some(c => productColors.includes(c));

        return matchesCategory && matchesSearch && matchesPrice && matchesColor;
      })
      .sort((a, b) => {
        if (sort === "prix-asc") return Number(a.prix) - Number(b.prix);
        if (sort === "prix-desc") return Number(b.prix) - Number(a.prix);
        return 0;
      });
  }, [produits, activeCategory, searchQuery, minPrice, maxPrice, activeColors, sort]);

  return (
    <div className="bg-white px-5 py-16 lg:px-10 animate-page">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center animate-fade-up">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B]">Catalogue</p>
          <h1 className="mt-4 font-serif text-4xl font-normal uppercase tracking-[0.1em] text-[#1A1A1A]">
            {searchQuery ? `Résultats pour "${searchQuery}"` : "Maroquinerie"}
          </h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-10 animate-slide-left">
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1A1A1A]">Catégorie</p>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-3 text-sm capitalize text-[#6B6B6B] cursor-pointer">
                    <input type="checkbox" checked={activeCategory === category} onChange={() => updateCategory(category)} />
                    {category.replaceAll("-", " ")}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1A1A1A]">Prix (DA)</p>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#6B6B6B]">
                    <span>Prix Min: {minPrice.toLocaleString()} DA</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    step="100"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
                    className="w-full h-1 bg-[#E8E8E8] appearance-none cursor-pointer accent-[#1A1A1A]" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#6B6B6B]">
                    <span>Prix Max: {maxPrice.toLocaleString()} DA</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
                    className="w-full h-1 bg-[#E8E8E8] appearance-none cursor-pointer accent-[#1A1A1A]" 
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-between text-[10px] font-bold text-[#1A1A1A]">
                <span>GAMME: {minPrice} - {maxPrice} DA</span>
              </div>
            </div>

            {availableColors.length > 0 && (
              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1A1A1A]">Couleurs</p>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((color) => (
                    <button 
                      key={color} 
                      type="button" 
                      onClick={() => toggleColor(color)}
                      className={`h-7 w-7 rounded-full border transition-all duration-300 relative ${activeColors.includes(color) ? 'border-[#1A1A1A] scale-110 ring-2 ring-offset-2 ring-[#E8E8E8]' : 'border-[#E8E8E8]'}`} 
                      style={{ backgroundColor: color }} 
                    >
                      {activeColors.includes(color) && (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white mix-blend-difference">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                {activeColors.length > 0 && (
                  <button 
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.delete("couleurs");
                      setSearchParams(next);
                    }}
                    className="mt-3 text-[10px] uppercase tracking-widest text-or hover:underline"
                  >
                    Effacer les couleurs
                  </button>
                )}
              </div>
            )}
          </aside>

          <section className="animate-slide-right lg:pl-8">
            <div className="mb-8 flex flex-col gap-4 border-b border-[#E8E8E8] pb-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#6B6B6B]">{filteredProducts.length} résultats</p>
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="input-base max-w-xs">
                <option value="nouveautes">Nouveautés</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
              </select>
            </div>

            {loading && <Spinner label="Chargement du catalogue..." />}
            {error && <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
            {!loading && !error && (
              <div className="grid gap-x-12 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((produit) => (
                  <CarteProduit key={produit.id} produit={produit} />
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-[#6B6B6B]">Aucun produit ne correspond à vos critères.</p>
                    <button onClick={() => {
                      setSearchParams({});
                      setMinPrice(0);
                      setMaxPrice(10000);
                    }} className="mt-4 text-sm underline underline-offset-4">Réinitialiser les filtres</button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
