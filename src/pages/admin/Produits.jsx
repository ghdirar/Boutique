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
  const [deleteProduit, setDeleteProduit] = useState(null);

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

  const handleDelete = (produit) => {
    setDeleteProduit(produit);
  };

  const confirmDelete = async () => {
    if (!deleteProduit) return;
    try {
      setError("");
      await deleteDoc(doc(db, "produits", deleteProduit.id));
      setProduits((current) => current.filter((item) => item.id !== deleteProduit.id));
    } catch {
      setError("Suppression impossible pour le moment.");
    } finally {
      setDeleteProduit(null);
    }
  };

  if (loading) {
    return <Spinner label="Chargement des produits..." />;
  }

  return (
    <div className="space-y-10 animate-page">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-black/[0.05] pb-8 animate-fade-up">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">
            Administration
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium uppercase tracking-[0.05em] text-[#080808] sm:text-4xl">
            Gestion des Produits
          </h1>
          <p className="mt-1 text-xs text-[#7a7368]">
            Ajoutez, modifiez ou retirez des pièces de votre catalogue.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/produits/ajouter"
            className="btn-primary h-11 rounded-full text-xs font-bold uppercase tracking-[0.15em] flex items-center bg-[#080808] hover:bg-[#c9a84c] text-white hover:text-white"
          >
            + Ajouter un produit
          </Link>
        </div>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Table container */}
      <div className="rounded-[28px] overflow-hidden bg-white border border-black/[0.04] shadow-sm overflow-x-auto animate-fade-up">
        <table className="min-w-full divide-y divide-black/[0.04] text-left text-sm">
          <thead className="bg-[#f7f4ef]/60 text-[#7a7368] text-[10px] font-bold uppercase tracking-[0.15em]">
            <tr>
              <th className="px-6 py-5">Image</th>
              <th className="px-6 py-5">Nom</th>
              <th className="px-6 py-5">Prix</th>
              <th className="px-6 py-5">Stock</th>
              <th className="px-6 py-5">Catégorie</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.03]">
            {produits.map((produit) => (
              <tr key={produit.id} className="hover:bg-[#f7f4ef]/10 transition-colors duration-300">
                <td className="px-6 py-4">
                  <img
                    src={produit.couleurs?.[0]?.imageUrl || produit.imageUrl}
                    alt={produit.nom}
                    className="h-16 w-14 rounded-xl object-cover shadow-sm border border-black/[0.03]"
                  />
                </td>
                <td className="px-6 py-4 font-semibold text-[#080808]">{produit.nom}</td>
                <td className="px-6 py-4 font-medium text-[#c9a84c]">{formatPrice(produit.prix)}</td>
                <td className="px-6 py-4 text-[#7a7368] font-mono">{produit.stock}</td>
                <td className="px-6 py-4 text-[#7a7368] uppercase tracking-[0.05em] text-xs font-medium">{produit.categorie}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <Link
                      to={`/admin/produits/modifier/${produit.id}`}
                      className="btn-secondary !px-4 h-9 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] flex items-center"
                    >
                      Modifier
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(produit)}
                      className="rounded-full bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 px-4 h-9 text-[10px] font-bold uppercase tracking-[0.1em] text-red-600 hover:text-red-700 transition-all duration-300"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── CUSTOM CONFIRMATION DIALOG ── */}
      {deleteProduit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300 animate-fade-in">
          <div className="mx-4 w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl border border-black/[0.04] text-center animate-scale-in">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 text-2xl shadow-sm">
              ⚠️
            </div>
            <h3 className="font-serif text-2xl font-medium uppercase tracking-[0.06em] text-[#080808]">
              Supprimer Produit
            </h3>
            <p className="mt-4 text-xs leading-6 text-[#7a7368]">
              Êtes-vous sûr de vouloir supprimer définitivement le produit <span className="font-bold text-[#080808]">"{deleteProduit.nom}"</span> ?
              Cette action retirera cet article de la boutique en ligne.
            </p>
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteProduit(null)}
                className="btn-secondary flex-1 h-12 rounded-full !px-0 text-xs font-bold uppercase tracking-[0.15em]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white shadow-[0_4px_15px_rgba(220,38,38,0.2)] flex-1 h-12 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
