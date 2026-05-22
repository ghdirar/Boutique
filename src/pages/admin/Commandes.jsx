import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { db } from "../../firebase";

const statusColors = {
  "en attente": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "confirmée": "bg-sky-50 text-sky-700 border-sky-200",
  "expédiée": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "livrée": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const statuses = ["en attente", "confirmée", "expédiée", "livrée"];

function formatPrice(value) {
  return `${Number(value).toLocaleString("fr-FR")} DA`;
}

export default function CommandesAdmin() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchCommandes = async () => {
    try {
      setLoading(true);
      setError("");
      const snapshot = await getDocs(query(collection(db, "commandes"), orderBy("date", "desc")));
      setCommandes(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch {
      setError("Impossible de charger les commandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  const handleStatusChange = async (commandeId, statut) => {
    try {
      await updateDoc(doc(db, "commandes", commandeId), { statut });
      setCommandes((current) =>
        current.map((commande) => (commande.id === commandeId ? { ...commande, statut } : commande)),
      );
    } catch {
      setError("Mise à jour du statut impossible.");
    }
  };

  const handleDeleteCommande = (commandeId) => {
    setDeleteId(commandeId);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setError("");
      await deleteDoc(doc(db, "commandes", deleteId));
      setCommandes((current) => current.filter((commande) => commande.id !== deleteId));
    } catch (err) {
      setError("Impossible de supprimer la commande.");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return <Spinner label="Chargement des commandes..." />;
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
            Gestion des Commandes
          </h1>
          <p className="mt-1 text-xs text-[#7a7368]">
            Visualisez, modifiez les statuts et organisez les livraisons.
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {commandes.length === 0 ? (
        <div className="rounded-[28px] bg-white border border-black/[0.04] p-12 text-center animate-fade-up">
          <p className="text-4xl mb-4">📋</p>
          <h3 className="font-serif text-xl font-medium text-[#080808] uppercase tracking-[0.05em]">Aucune commande</h3>
          <p className="mt-2 text-sm text-[#7a7368]">Aucune commande n'a été enregistrée pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {commandes.map((commande, i) => (
            <article
              key={commande.id}
              className="rounded-[28px] bg-white border border-black/[0.04] p-8 shadow-sm animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between border-b border-black/[0.04] pb-6">
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl font-semibold uppercase tracking-[0.02em] text-[#080808]">
                    {commande.client?.prenom} {commande.client?.nom}
                  </h2>
                  <p className="text-xs text-[#7a7368] flex flex-wrap gap-x-3 gap-y-1">
                    <span className="font-semibold text-[#080808]">📞 {commande.client?.telephone}</span>
                    {commande.client?.email && (
                      <>
                        <span>•</span>
                        <span>✉️ {commande.client?.email}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-[#7a7368] flex flex-wrap gap-x-2 gap-y-1">
                    <span className="font-semibold text-[#080808]">📍 {commande.client?.wilaya}</span>
                    {commande.client?.commune && (
                      <>
                        <span>—</span>
                        <span>{commande.client.commune}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{commande.client?.adresse}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] border ${statusColors[commande.statut] || "bg-gray-100 text-gray-700"}`}>
                    {commande.statut}
                  </span>

                  <select
                    value={commande.statut}
                    onChange={(event) => handleStatusChange(commande.id, event.target.value)}
                    className="h-10 rounded-full px-4 bg-[#f7f4ef] border border-black/[0.05] text-xs font-semibold text-[#080808] focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all duration-300 cursor-pointer"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        Modifier : {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order articles */}
              <div className="mt-6 space-y-4">
                {commande.articles?.map((article, idx) => (
                  <div key={`${commande.id}-${idx}`} className="rounded-2xl border border-black/[0.03] bg-[#f7f4ef]/30 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <img src={article.imageUrl} alt={article.nom} className="h-20 w-16 rounded-xl object-cover shadow-sm" />
                      <div className="flex-1">
                        <p className="font-semibold text-[#080808] leading-snug">{article.nom}</p>
                        <p className="mt-1 text-xs text-[#7a7368]">
                          Couleur : <span className="font-medium text-[#080808]">{article.couleur}</span>
                          {article.taille ? (
                            <>
                              <span className="mx-2">•</span>
                              Taille : <span className="font-medium text-[#080808]">{article.taille}</span>
                            </>
                          ) : null}
                          <span className="mx-2">•</span>
                          Quantité : <span className="font-medium text-[#080808]">{article.quantite}</span>
                        </p>
                      </div>
                      <p className="font-semibold text-[#c9a84c] text-base">{formatPrice(article.prix * article.quantite)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.04] pt-5">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-[#a09a91]">ID: {commande.numero || commande.id}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCommande(commande.id)}
                    className="rounded-full bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-red-600 hover:text-red-700 transition-all duration-300"
                  >
                    Supprimer
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7a7368]">Total</span>
                  <span className="font-serif text-2xl font-bold text-[#c9a84c]">{formatPrice(commande.total)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── CUSTOM CONFIRMATION DIALOG ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300 animate-fade-in">
          <div className="mx-4 w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl border border-black/[0.04] text-center animate-scale-in">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 text-2xl shadow-sm">
              ⚠️
            </div>
            <h3 className="font-serif text-2xl font-medium uppercase tracking-[0.06em] text-[#080808]">
              Supprimer Commande
            </h3>
            <p className="mt-4 text-xs leading-6 text-[#7a7368]">
              Êtes-vous absolument sûr de vouloir supprimer définitivement la commande <span className="font-mono font-bold text-[#080808]">#{deleteId.slice(-8)}</span> ?
              Cette action supprimera toutes ses données dans la base de données.
            </p>
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
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
