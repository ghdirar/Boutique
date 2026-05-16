import { Link } from "react-router-dom";
import { usePanier } from "../context/PanierContext";

function formatPrice(value) {
  return `${Number(value).toLocaleString("fr-FR")} DA`;
}

export default function Panier() {
  const { articles, total, modifierQuantite, supprimerArticle } = usePanier();

  if (articles.length === 0) {
    return (
      <div className="card-surface rounded-[2rem] p-10 text-center">
        <h1 className="text-3xl font-bold">Votre panier est vide</h1>
        <p className="mt-3 text-white/65">Ajoutez quelques pièces depuis le catalogue.</p>
        <Link to="/catalogue" className="btn-primary mt-6">
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4">
        <h1 className="section-title">Votre panier</h1>

        {articles.map((article, index) => (
          <article key={`${article.produitId}-${article.taille}-${article.couleur}-${index}`} className="card-surface flex flex-col gap-4 p-5 sm:flex-row">
            <img src={article.imageUrl} alt={article.nom} className="h-36 w-full rounded-2xl object-cover sm:w-28" />

            <div className="flex-1 space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{article.nom}</h2>
                  <p className="text-sm text-white/60">
                    Taille : {article.taille} • Couleur : {article.couleur}
                  </p>
                </div>
                <p className="text-lg font-bold text-or">{formatPrice(article.prix * article.quantite)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/15 px-3 py-2">
                  <button type="button" onClick={() => modifierQuantite(index, article.quantite - 1)}>
                    -
                  </button>
                  <span>{article.quantite}</span>
                  <button type="button" onClick={() => modifierQuantite(index, article.quantite + 1)}>
                    +
                  </button>
                </div>

                <button type="button" onClick={() => supprimerArticle(index)} className="text-sm font-semibold text-red-300">
                  Supprimer
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="card-surface h-fit rounded-[2rem] p-6">
        <h2 className="text-2xl font-semibold">Résumé</h2>
        <div className="mt-6 space-y-3 text-sm text-white/70">
          <div className="flex items-center justify-between">
            <span>Sous-total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Livraison</span>
            <span>À confirmer</span>
          </div>
          <div className="border-t border-white/10 pt-4 text-base font-bold text-white">
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="text-or">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <Link to="/commande" className="btn-primary mt-6 w-full">
          Passer la commande
        </Link>
      </aside>
    </div>
  );
}
