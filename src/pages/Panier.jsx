import { Link } from "react-router-dom";
import { usePanier } from "../context/PanierContext";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";

function formatPrice(value, lang) {
  return `${Number(value).toLocaleString("fr-FR")} ${lang === "ar" ? "د.ج" : "DA"}`;
}

export default function Panier() {
  const { articles, total, modifierQuantite, supprimerArticle } = usePanier();
  const { addToast } = useToast();
  const { t, lang } = useLanguage();
  
  const totalArticles = articles.reduce((acc, item) => acc + item.quantite, 0);
  const livraisonOfferte = totalArticles >= 3;
  const livraisonThreshold = 3;
  const remaining = livraisonThreshold - totalArticles;
  const progressPct = Math.min((totalArticles / livraisonThreshold) * 100, 100);

  const handleRemove = (index, nom) => {
    supprimerArticle(index);
    const toastMsg = lang === "fr" ? `${nom} retiré du panier` : `تم حذف ${nom} من السلة`;
    addToast(toastMsg, "🗑️");
  };

  if (articles.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f7f4ef] px-5 py-20 text-center animate-page">
        <div className="mb-8 text-6xl">🛍️</div>
        <h1 className="font-serif text-3xl uppercase tracking-[0.1em] animate-fade-up">
          {t("panier_vide")}
        </h1>
        <p className="mt-4 text-sm text-[#7a7368] animate-fade-up delay-150">
          {lang === "fr"
            ? "Ajoutez une pièce depuis le catalogue pour commencer."
            : "أضيفي قطعة من الكتالوج للبدء بالتسوق."}
        </p>
        <Link to="/catalogue" className="btn-primary mt-8 animate-fade-up delay-300">
          {t("voir_catalogue")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 lg:grid-cols-[1fr_380px] lg:px-10 animate-page">

        {/* ── ITEMS LIST ── */}
        <section className="animate-slide-left">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-serif text-3xl uppercase tracking-[0.1em]">
              {t("panier_titre")} <span className="text-[#c9a84c]">({articles.length})</span>
            </h1>
            <Link to="/catalogue" className="text-sm text-[#7a7368] hover:text-[#080808] transition-colors">
              {lang === "fr" ? "← Continuer les achats" : "← مواصلة التسوق"}
            </Link>
          </div>

          <div className="space-y-4">
            {articles.map((article, index) => (
              <div
                key={`${article.produitId}-${article.taille}-${article.couleur}-${index}`}
                className="flex gap-5 rounded-2xl bg-white p-4 shadow-sm border border-black/[0.03] animate-fade-up"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <Link to={`/produit/${article.produitId}`} className="shrink-0">
                  <img
                    src={article.imageUrl}
                    alt={article.nom}
                    className="h-28 w-24 rounded-xl object-cover transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-medium text-[#080808] leading-snug">{article.nom}</h2>
                      <p className="mt-1 text-sm text-[#7a7368]">
                        {article.couleur}{article.taille ? ` / ${article.taille}` : ""}
                      </p>
                    </div>
                    <p className="font-semibold text-[#c9a84c] shrink-0">{formatPrice(article.prix * article.quantite, lang)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Qty stepper */}
                    <div className="flex items-center overflow-hidden rounded-full border border-black/[0.07] bg-[#f7f4ef]">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center text-sm font-bold text-[#080808] transition hover:bg-black/[0.05] disabled:opacity-30 cursor-pointer"
                        onClick={() => modifierQuantite(index, article.quantite - 1)}
                        disabled={article.quantite <= 1}
                      >
                        −
                      </button>
                      <span className="min-w-[32px] text-center text-sm font-semibold">{article.quantite}</span>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center text-sm font-bold text-[#080808] transition hover:bg-black/[0.05] cursor-pointer"
                        onClick={() => modifierQuantite(index, article.quantite + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(index, article.nom)}
                      className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#7a7368] transition hover:text-red-500 cursor-pointer"
                    >
                      {t("retirer")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ORDER SUMMARY ── */}
        <aside className="animate-slide-right">
          <div className="sticky top-[100px] rounded-2xl bg-white p-6 shadow-sm border border-black/[0.03]">
            <h2 className="font-serif text-xl uppercase tracking-[0.1em] text-[#080808]">{t("recap_commande")}</h2>

            {/* Free shipping progress bar */}
            <div className="mt-5 rounded-xl bg-[#f7f4ef] p-4">
              {livraisonOfferte ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-[#c9a84c]">
                  <span>✓</span> {t("livraison_gratuite_alert")}
                </div>
              ) : (
                <div>
                  <p className="text-[12px] text-[#7a7368]">
                    {t("livraison_gratuite_progress", { n: remaining })}
                  </p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-[#ede9e0] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#c9a84c] transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="mt-5 space-y-3 border-t border-black/[0.05] pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#7a7368]">{t("sous_total")}</span>
                <span className="font-medium">{formatPrice(total, lang)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7a7368]">{t("livraison")}</span>
                <span className={livraisonOfferte ? "font-semibold text-[#c9a84c]" : "text-[#7a7368]"}>
                  {livraisonOfferte ? t("offert_shipping") : (lang === "fr" ? "À confirmer" : "يتم تحديده")}
                </span>
              </div>
              <div className="flex justify-between border-t border-black/[0.05] pt-4 text-base font-bold">
                <span>{t("total")}</span>
                <span className="text-[#c9a84c]">{formatPrice(total, lang)}</span>
              </div>
            </div>

            <Link to="/commande" className="btn-primary mt-6 w-full block text-center">
              {t("passer_commande")}
            </Link>

            {/* Trust */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#7a7368]">
              <span>💰</span>
              <span>{lang === "fr" ? "Paiement à la livraison — payez à la réception" : "الدفع عند الاستلام — ادفع نقدًا عند استلام طردكِ"}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
