import { Link } from "react-router-dom";
import { usePanier } from "../context/PanierContext";

function formatPrice(value) {
  return `${Number(value).toLocaleString("fr-FR")} DA`;
}

export default function CarteProduit({ produit }) {
  const { ajouterAuPanier } = usePanier();

  const handleQuickAdd = () => {
    ajouterAuPanier({
      produitId: produit.id,
      nom: produit.nom,
      prix: produit.prix,
      taille: produit.tailles?.[0] || "M",
      couleur: produit.couleurs?.[0] || "noir",
      quantite: 1,
      imageUrl: produit.imageUrl,
    });
  };

  return (
    <article className="card-surface overflow-hidden">
      <Link to={`/produit/${produit.id}`} className="block">
        <img
          src={produit.imageUrl}
          alt={produit.nom}
          className="h-80 w-full object-cover transition duration-300 hover:scale-[1.03]"
        />
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-or">{produit.categorie}</p>
            <h3 className="mt-2 text-2xl font-semibold">{produit.nom}</h3>
          </div>
          <span className="text-lg font-bold text-or">{formatPrice(produit.prix)}</span>
        </div>

        <p className="text-sm text-white/65">{produit.description}</p>

        <div className="flex gap-3">
          <Link to={`/produit/${produit.id}`} className="btn-secondary flex-1">
            Voir
          </Link>
          <button type="button" onClick={handleQuickAdd} className="btn-primary flex-1">
            Ajouter
          </button>
        </div>
      </div>
    </article>
  );
}
