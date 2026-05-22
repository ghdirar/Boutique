import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CarteProduit from "../components/CarteProduit";
import Spinner from "../components/Spinner";
import useProduits from "../hooks/useProduits";

const categories = ["sacs-main"];
const sortOptions = [
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
];

export default function Catalogue() {
  const { produits, loading, error } = useProduits();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("nouveautes");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeCategory = searchParams.get("categorie") || "";
  const searchQuery = searchParams.get("q") || "";

  const activeColors = useMemo(() => {
    const val = searchParams.get("couleurs");
    return val ? val.split(",") : [];
  }, [searchParams]);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  const availableColors = useMemo(() => {
    const colorSet = new Set();
    produits.forEach((p) => {
      if (Array.isArray(p.couleurs)) {
        p.couleurs.forEach((c) => {
          if (typeof c === "object" && c.hex) colorSet.add(JSON.stringify({ hex: c.hex, nom: c.nom }));
          else if (typeof c === "string") colorSet.add(JSON.stringify({ hex: c, nom: c }));
        });
      }
    });
    return Array.from(colorSet).map((s) => JSON.parse(s));
  }, [produits]);

  const toggleColor = (hex) => {
    const next = new URLSearchParams(searchParams);
    const current = activeColors.includes(hex)
      ? activeColors.filter((c) => c !== hex)
      : [...activeColors, hex];
    current.length > 0 ? next.set("couleurs", current.join(",")) : next.delete("couleurs");
    setSearchParams(next);
  };

  const updateCategory = (category) => {
    const next = new URLSearchParams(searchParams);
    next.get("categorie") === category ? next.delete("categorie") : next.set("categorie", category);
    setSearchParams(next);
  };

  const resetFilters = () => {
    setSearchParams({});
    setMinPrice(0);
    setMaxPrice(10000);
  };

  const filteredProducts = useMemo(() => {
    return produits
      .filter((p) => {
        const matchesCategory = !activeCategory || p.categorie === activeCategory;
        const matchesSearch = !searchQuery || p.nom.toLowerCase().includes(searchQuery.toLowerCase());
        const price = Number(p.prix);
        const matchesPrice = price >= minPrice && price <= maxPrice;
        const productColors = Array.isArray(p.couleurs)
          ? p.couleurs.map((c) => (typeof c === "object" ? c.hex : c))
          : [];
        const matchesColor = activeColors.length === 0 || activeColors.some((c) => productColors.includes(c));
        return matchesCategory && matchesSearch && matchesPrice && matchesColor;
      })
      .sort((a, b) => {
        if (sort === "prix-asc") return Number(a.prix) - Number(b.prix);
        if (sort === "prix-desc") return Number(b.prix) - Number(a.prix);
        return 0;
      });
  }, [produits, activeCategory, searchQuery, minPrice, maxPrice, activeColors, sort]);

  const hasActiveFilters = activeCategory || activeColors.length > 0 || minPrice > 0 || maxPrice < 10000;

  const Sidebar = () => (
    <aside className="space-y-8">
      {/* Active filter count */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#c9a84c]">
            Filtres actifs
          </span>
          <button
            onClick={resetFilters}
            className="rounded-full bg-[#080808] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-[#c9a84c]"
          >
            Tout effacer
          </button>
        </div>
      )}

      {/* Category */}
      <div>
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#080808]">Catégorie</p>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label key={cat} className="flex cursor-pointer items-center gap-3 text-sm text-[#7a7368]">
              <input
                type="checkbox"
                checked={activeCategory === cat}
                onChange={() => updateCategory(cat)}
              />
              <span className={activeCategory === cat ? "font-semibold text-[#080808]" : ""}>
                {cat.replaceAll("-", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#080808]">Prix (DA)</p>
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex justify-between text-[11px] text-[#7a7368]">
              <span>Min</span>
              <span className="font-semibold text-[#080808]">{minPrice.toLocaleString()} DA</span>
            </div>
            <input
              type="range" min="0" max="10000" step="100"
              value={minPrice}
              onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 100))}
            />
          </div>
          <div>
            <div className="mb-2 flex justify-between text-[11px] text-[#7a7368]">
              <span>Max</span>
              <span className="font-semibold text-[#080808]">{maxPrice.toLocaleString()} DA</span>
            </div>
            <input
              type="range" min="0" max="10000" step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 100))}
            />
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-[#080808]/[0.04] px-4 py-3 text-center text-[12px] font-semibold text-[#080808]">
          {minPrice.toLocaleString()} – {maxPrice.toLocaleString()} DA
        </div>
      </div>

      {/* Colors */}
      {availableColors.length > 0 && (
        <div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#080808]">Couleurs</p>
          <div className="flex flex-wrap gap-2.5">
            {availableColors.map(({ hex, nom }) => (
              <button
                key={hex}
                type="button"
                title={nom}
                onClick={() => toggleColor(hex)}
                className={`relative h-8 w-8 rounded-full border-2 transition-all duration-200 ${
                  activeColors.includes(hex)
                    ? "border-[#c9a84c] scale-110 shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
                    : "border-[#d0cac0] hover:scale-110"
                }`}
                style={{ backgroundColor: hex }}
              >
                {activeColors.includes(hex) && (
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white mix-blend-difference">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      {/* ── Header ── */}
      <div className="border-b border-black/[0.05] bg-white py-12 px-5 text-center animate-fade-up">
        <p className="section-label mb-3">Catalogue</p>
        <h1 className="section-title">
          {searchQuery ? `Résultats pour « ${searchQuery} »` : "Maroquinerie"}
        </h1>
        {searchQuery && (
          <p className="mt-2 text-sm text-[#7a7368]">{filteredProducts.length} résultat{filteredProducts.length > 1 ? "s" : ""} trouvé{filteredProducts.length > 1 ? "s" : ""}</p>
        )}
      </div>

      <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 animate-page">
        {/* Mobile filter toggle */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:border-black/15"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M7 12h10M10 18h4"/>
            </svg>
            Filtres {hasActiveFilters && <span className="ml-1 h-2 w-2 rounded-full bg-[#c9a84c]" />}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-base max-w-[180px]"
          >
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
          {/* Desktop sidebar */}
          <div className="hidden lg:block animate-slide-left">
            <Sidebar />
          </div>

          {/* Products */}
          <section className="animate-slide-right">
            {/* Sort bar (desktop) */}
            <div className="mb-8 hidden items-center justify-between lg:flex">
              <p className="text-sm text-[#7a7368]">
                <span className="font-semibold text-[#080808]">{filteredProducts.length}</span> article{filteredProducts.length > 1 ? "s" : ""}
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-base max-w-[220px]"
              >
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {loading && <Spinner label="Chargement du catalogue..." />}
            {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
            {!loading && !error && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((produit) => (
                  <CarteProduit key={produit.id} produit={produit} />
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-24 text-center">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="text-lg font-medium text-[#080808]">Aucun résultat</p>
                    <p className="mt-2 text-sm text-[#7a7368]">Aucun produit ne correspond à vos critères de recherche.</p>
                    <button
                      onClick={resetFilters}
                      className="btn-secondary mt-6 inline-flex"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[70] flex lg:hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative ml-auto h-full w-[300px] overflow-y-auto bg-[#f7f4ef] shadow-2xl p-6 animate-slide-right">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-[0.2em]">Filtres</p>
              <button onClick={() => setIsSidebarOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/[0.05]">✕</button>
            </div>
            <Sidebar />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="btn-primary mt-8 w-full"
            >
              Appliquer ({filteredProducts.length} résultats)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
