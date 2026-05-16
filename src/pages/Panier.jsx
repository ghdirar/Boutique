import { Link } from "react-router-dom";
import { usePanier } from "../context/PanierContext";

function formatPrice(value) {
  return `${Number(value).toLocaleString("fr-FR")} DA`;
}

export default function Panier() {
  const { articles, total, modifierQuantite, supprimerArticle } = usePanier();
  const livraisonOfferte = total >= 5000;

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center animate-page">
        <h1 className="font-serif text-3xl font-normal uppercase tracking-[0.1em] animate-fade-up">Votre panier est vide</h1>
        <p className="mt-4 text-sm text-[#6B6B6B] animate-fade-up delay-200">Ajoutez une piece depuis le catalogue.</p>
        <Link to="/catalogue" className="btn-primary mt-8 animate-fade-up delay-400">
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[60fr_40fr] lg:px-10 animate-page">
      <section className="animate-slide-left">
        <h1 className="mb-10 font-serif text-3xl font-normal uppercase tracking-[0.1em]">Panier</h1>

        <div className="space-y-0">
          {articles.map((article, index) => (
            <article key={`${article.produitId}-${article.taille}-${article.couleur}-${index}`} className="grid grid-cols-[80px_1fr] gap-5 border-b border-[#E8E8E8] py-6 sm:grid-cols-[80px_1fr_auto]">
              <img src={article.imageUrl} alt={article.nom} className="h-[100px] w-20 object-cover" />
              <div>
                <h2 className="text-sm text-[#1A1A1A]">{article.nom}</h2>
                <p className="mt-2 text-sm text-[#6B6B6B]">
                  {article.couleur} {article.taille ? `/ ${article.taille}` : ""}
                </p>
                <div className="mt-4 inline-flex items-center border border-[#E8E8E8]">
                  <button type="button" className="px-3 py-1" onClick={() => modifierQuantite(index, article.quantite - 1)}>
                    -
                  </button>
                  <span className="min-w-8 text-center text-sm">{article.quantite}</span>
                  <button type="button" className="px-3 py-1" onClick={() => modifierQuantite(index, article.quantite + 1)}>
                    +
                  </button>
                </div>
                <button type="button" onClick={() => supprimerArticle(index)} className="ml-4 text-[12px] uppercase tracking-[0.12em] text-[#6B6B6B] underline underline-offset-4">
                  Supprimer
                </button>
              </div>
              <p className="text-sm text-[#1A1A1A]">{formatPrice(article.prix * article.quantite)}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="h-fit bg-[#F5F5F3] p-6 animate-slide-right">
        <h2 className="font-serif text-2xl font-normal uppercase tracking-[0.1em]">Recapitulatif</h2>
        <div className="mt-6 space-y-4 border-b border-[#E8E8E8] pb-6 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6B6B6B]">Sous-total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B6B6B]">Livraison</span>
            <span>{livraisonOfferte ? "Offerte" : "A confirmer"}</span>
          </div>
        </div>
        <p className="mt-5 text-sm text-[#6B6B6B]">
          {livraisonOfferte ? "La livraison offerte est appliquee." : "Livraison offerte des 5000 DA."}
        </p>
        <div className="mt-6 flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Link to="/commande" className="btn-primary mt-8 w-full">
          Commander
        </Link>
      </aside>
    </div>
  );
}
