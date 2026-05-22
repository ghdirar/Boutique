import { collection, getCountFromServer, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalCommandes: 0,
    commandesEnAttente: 0,
    totalProduits: 0,
    latestOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError("");

        const [commandesSnap, attenteSnap, produitsDocs, latestSnapshot] = await Promise.all([
          getCountFromServer(collection(db, "commandes")),
          getCountFromServer(query(collection(db, "commandes"), where("statut", "==", "en attente"))),
          getDocs(query(collection(db, "produits"), orderBy("dateAjout", "desc"))),
          getDocs(query(collection(db, "commandes"), orderBy("date", "desc"), limit(5))),
        ]);

        setStats({
          totalCommandes: commandesSnap.data().count,
          commandesEnAttente: attenteSnap.data().count,
          totalProduits: produitsDocs.size,
          latestOrders: latestSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
        });
      } catch (fetchError) {
        console.error(fetchError);
        setError("Impossible de charger le tableau de bord.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <Spinner label="Chargement du dashboard..." />;

  const statCards = [
    { label: "Commandes", value: stats.totalCommandes, icon: "📦", delay: "delay-100" },
    { label: "En attente", value: stats.commandesEnAttente, icon: "⏳", delay: "delay-200" },
    { label: "Produits", value: stats.totalProduits, icon: "🛍️", delay: "delay-300" },
  ];

  return (
    <div className="space-y-10 animate-page">
      {/* Header banner */}
      <div className="flex flex-col gap-2 border-b border-black/[0.05] pb-6 animate-fade-up">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">
          Vue d'ensemble
        </p>
        <h1 className="font-serif text-3xl font-medium uppercase tracking-[0.05em] text-[#080808] sm:text-4xl">
          Tableau de Bord
        </h1>
        <p className="text-xs text-[#7a7368]">
          Gérez votre boutique, suivez vos commandes et organisez vos produits en temps réel.
        </p>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Stat Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        {statCards.map(({ label, value, icon, delay }) => (
          <article
            key={label}
            className={`rounded-[28px] bg-white border border-black/[0.04] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#c9a84c]/20 animate-fade-up ${delay}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#7a7368]">
                {label}
              </p>
              <span className="text-2xl filter drop-shadow-sm">{icon}</span>
            </div>
            <h2 className="mt-5 font-serif text-5xl font-medium tracking-tight text-[#080808] tabular-nums">
              {value}
            </h2>
          </article>
        ))}
      </section>

      {/* Latest Orders */}
      <section className="rounded-[28px] bg-white border border-black/[0.04] p-8 shadow-sm animate-fade-up delay-400">
        <div className="flex items-center justify-between border-b border-black/[0.04] pb-5">
          <h2 className="font-serif text-2xl font-medium uppercase tracking-[0.05em] text-[#080808]">
            Dernières commandes
          </h2>
          <Link
            to="/admin/commandes"
            className="text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c] hover:text-[#080808] transition-colors"
          >
            Voir tout →
          </Link>
        </div>
        <div className="mt-6 space-y-4">
          {stats.latestOrders.length === 0 && (
            <p className="text-sm text-[#7a7368] italic py-4">Aucune commande pour le moment.</p>
          )}
          {stats.latestOrders.map((commande, i) => (
            <article
              key={commande.id}
              className={`rounded-2xl border border-black/[0.03] bg-[#f7f4ef]/30 p-5 transition-all duration-300 hover:bg-[#f7f4ef]/60 animate-fade-up`}
              style={{ animationDelay: `${(i + 1) * 80}ms` }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-[#080808]">
                    {commande.client?.prenom} {commande.client?.nom}
                  </p>
                  <p className="mt-1 text-xs text-[#7a7368] flex flex-wrap gap-x-2 gap-y-1">
                    <span className="font-medium text-[#080808]">{commande.client?.telephone}</span>
                    <span>•</span>
                    <span>{commande.client?.wilaya}</span>
                    {commande.client?.commune && (
                      <>
                        <span>—</span>
                        <span>{commande.client.commune}</span>
                      </>
                    )}
                  </p>
                </div>
                <span className="rounded-full bg-[#c9a84c]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#c9a84c] self-start sm:self-auto border border-[#c9a84c]/20">
                  {commande.statut}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
