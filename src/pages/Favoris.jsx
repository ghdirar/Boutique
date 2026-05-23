import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useFavoris } from "../context/FavorisContext";
import useProduits from "../hooks/useProduits";
import CarteProduit from "../components/CarteProduit";
import Spinner from "../components/Spinner";
import { useLanguage } from "../context/LanguageContext";

export default function Favoris() {
  const { favoris } = useFavoris();
  const { produits, loading, error } = useProduits();
  const { t, lang } = useLanguage();

  const favorisProduits = useMemo(() => {
    return produits.filter((p) => favoris.includes(p.id));
  }, [produits, favoris]);

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      {/* Header */}
      <div className="border-b border-black/[0.05] bg-white px-5 py-12 text-center animate-fade-up">
        <p className="section-label mb-3">{t("selection_curatee")}</p>
        <h1 className="section-title">
          {t("mes_favoris")}
          {favoris.length > 0 && (
            <span className={`${lang === "ar" ? "mr-3" : "ml-3"} align-middle text-[#c9a84c]`}>({favoris.length})</span>
          )}
        </h1>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 animate-page">
        {loading && <Spinner label={t("chargement")} />}
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
                  {lang === "fr" ? "Aucun favori pour l'instant" : "لا توجد مفضلات حاليًا"}
                </h2>
                <p className="mt-4 max-w-sm text-sm text-[#7a7368] leading-7">
                  {lang === "fr"
                    ? "Parcourez notre catalogue et cliquez sur le cœur pour sauvegarder vos pièces préférées."
                    : "تصفحي كتالوج منتجاتنا واضغطي على رمز القلب لحفظ قطعكِ المفضلة هنا."}
                </p>
                <Link to="/catalogue" className="btn-primary mt-8 inline-flex">
                  {t("voir_catalogue")}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
