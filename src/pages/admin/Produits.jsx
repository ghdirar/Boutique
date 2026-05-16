import { deleteDoc, doc, getDocs, collection, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { db } from "../../firebase";

function formatPrice(value) {
  return `${Number(value).toLocaleString("fr-FR")} DA`;
}

export default function ProduitsAdmin() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProduits = async () => {
    try {
      setLoading(true);
      setError("");
      const snapshot = await getDocs(query(collection(db, "produits"), orderBy("dateAjout", "desc")));
      setProduits(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (fetchError) {
      setError("Impossible de charger les produits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const handleDelete = async (produit) => {
    const confirmed = window.confirm(`Supprimer le produit "${produit.nom}" ?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(doc(db, "produits", produit.id));

      setProduits((current) => current.filter((item) => item.id !== produit.id));
    } catch {
      setError("Suppression impossible pour le moment.");
    }
  };

  if (loading) {
    return <Spinner label="Chargement des produits..." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-or">Administration</p>
          <h1 className="mt-3 text-4xl font-bold">Gestion des produits</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/dashboard" className="btn-secondary">
            Dashboard
          </Link>
          <Link to="/admin/produits/ajouter" className="btn-primary">
            Ajouter un produit
          </Link>
        </div>
      </div>

      {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</p>}

      <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-4 py-4">Image</th>
              <th className="px-4 py-4">Nom</th>
              <th className="px-4 py-4">Prix</th>
              <th className="px-4 py-4">Stock</th>
              <th className="px-4 py-4">Catégorie</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {produits.map((produit) => (
              <tr key={produit.id}>
                <td className="px-4 py-4">
                  <img src={produit.imageUrl} alt={produit.nom} className="h-16 w-16 rounded-2xl object-cover" />
                </td>
                <td className="px-4 py-4 font-semibold">{produit.nom}</td>
                <td className="px-4 py-4 text-or">{formatPrice(produit.prix)}</td>
                <td className="px-4 py-4">{produit.stock}</td>
                <td className="px-4 py-4">{produit.categorie}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/admin/produits/modifier/${produit.id}`} className="btn-secondary !px-4 !py-2">
                      Modifier
                    </Link>
                    <button type="button" onClick={() => handleDelete(produit)} className="rounded-full bg-red-500/20 px-4 py-2 font-semibold text-red-200">
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
