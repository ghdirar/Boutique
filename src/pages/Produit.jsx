import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { usePanier } from "../context/PanierContext";
import { db } from "../firebase";

function formatPrice(value) {
  return `${Number(value).toLocaleString("fr-FR")} DA`;
}

export default function Produit() {
  const { id } = useParams();
  const { ajouterAuPanier } = usePanier();
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantite, setQuantite] = useState(1);

  useEffect(() => {
    async function fetchProduit() {
      try {
        setLoading(true);
        setError("");
        const snapshot = await getDoc(doc(db, "produits", id));

        if (!snapshot.exists()) {
          setError("Produit introuvable.");
          return;
        }

        const data = { id: snapshot.id, ...snapshot.data() };
        setProduit(data);
        setSelectedSize(data.tailles?.[0] || "");
        setSelectedColor(data.couleurs?.[0] || "");
      } catch (fetchError) {
        setError("Impossible de charger ce produit.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduit();
  }, [id]);

  const handleAddToCart = () => {
    if (!produit) {
      return;
    }

    ajouterAuPanier({
      produitId: produit.id,
      nom: produit.nom,
      prix: produit.prix,
      taille: selectedSize,
      couleur: selectedColor,
      quantite,
      imageUrl: produit.imageUrl,
    });
  };

  if (loading) {
    return <Spinner label="Chargement du produit..." />;
  }

  if (error || !produit) {
    return (
      <div className="card-surface rounded-[2rem] p-8 text-center">
        <p className="mb-4 text-red-200">{error || "Produit indisponible."}</p>
        <Link to="/catalogue" className="btn-secondary">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="card-surface overflow-hidden">
        <img src={produit.imageUrl} alt={produit.nom} className="h-full min-h-[500px] w-full object-cover" />
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-or">{produit.categorie}</p>
          <h1 className="text-4xl font-bold">{produit.nom}</h1>
          <p className="text-3xl font-bold text-or">{formatPrice(produit.prix)}</p>
          <p className="text-white/70">{produit.description}</p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-white/60">Taille</p>
            <div className="flex flex-wrap gap-3">
              {produit.tailles?.map((taille) => (
                <button
                  key={taille}
                  type="button"
                  onClick={() => setSelectedSize(taille)}
                  className={`rounded-full px-5 py-2 font-semibold ${
                    selectedSize === taille ? "bg-or text-black" : "border border-white/15 text-white/75"
                  }`}
                >
                  {taille}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-white/60">Couleur</p>
            <div className="flex flex-wrap gap-3">
              {produit.couleurs?.map((couleur) => (
                <button
                  key={couleur}
                  type="button"
                  onClick={() => setSelectedColor(couleur)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 ${
                    selectedColor === couleur ? "border-or text-or" : "border-white/15 text-white/70"
                  }`}
                >
                  <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: couleur }} />
                  {couleur}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-white/60">Quantité</p>
            <div className="inline-flex items-center gap-4 rounded-full border border-white/15 px-4 py-2">
              <button type="button" onClick={() => setQuantite((current) => Math.max(1, current - 1))}>
                -
              </button>
              <span className="min-w-8 text-center">{quantite}</span>
              <button type="button" onClick={() => setQuantite((current) => current + 1)}>
                +
              </button>
            </div>
          </div>

          <button type="button" onClick={handleAddToCart} className="btn-primary w-full">
            Ajouter au panier
          </button>

          <p className="text-sm text-white/55">Stock disponible : {produit.stock}</p>
        </div>
      </div>
    </div>
  );
}
