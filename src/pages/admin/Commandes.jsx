import { collection, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { db } from "../../firebase";

const statusColors = {
  "en attente": "bg-yellow-100 text-yellow-700",
  "confirmée": "bg-sky-100 text-sky-700",
  "expédiée": "bg-indigo-100 text-indigo-700",
  "livrée": "bg-emerald-100 text-emerald-700",
};

const statuses = ["en attente", "confirmée", "expédiée", "livrée"];

function formatPrice(value) {
  return `${Number(value).toLocaleString("fr-FR")} DA`;
}

export default function CommandesAdmin() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <Spinner label="Chargement des commandes..." />;
  }

  return (
    <div className="space-y-8 animate-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-or">Administration</p>
          <h1 className="mt-3 text-4xl font-bold">Gestion des commandes</h1>
        </div>
        <Link to="/admin/dashboard" className="btn-secondary">
          Dashboard
        </Link>
      </div>

      {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</p>}

      <div className="space-y-5">
        {commandes.map((commande) => (
          <article key={commande.id} className="card-surface p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{commande.client?.nom}</h2>
                <p className="text-sm text-[#6B6B6B]">
                  {commande.client?.telephone} • {commande.client?.email}
                </p>
                <p className="text-sm text-[#6B6B6B]">
                  {commande.client?.adresse} • {commande.client?.wilaya}
                  {commande.client?.commune ? ` — ${commande.client.commune}` : ""}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusColors[commande.statut]}`}>
                  {commande.statut}
                </span>

                <select
                  value={commande.statut}
                  onChange={(event) => handleStatusChange(commande.id, event.target.value)}
                  className="input-base min-w-[180px]"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {commande.articles?.map((article, index) => (
                <div key={`${commande.id}-${index}`} className="border border-[#E8E8E8] bg-[#F5F5F3] p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <img src={article.imageUrl} alt={article.nom} className="h-20 w-20 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold">{article.nom}</p>
                      <p className="text-sm text-[#6B6B6B]">
                        Couleur : {article.couleur} • Quantité : {article.quantite}
                      </p>
                    </div>
                    <p className="font-semibold text-or">{formatPrice(article.prix * article.quantite)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#E8E8E8] pt-4">
              <span className="text-sm text-[#6B6B6B]">Commande #{commande.id}</span>
              <span className="text-lg font-bold text-or">{formatPrice(commande.total)}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
