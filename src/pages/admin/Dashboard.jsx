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
    <div className="space-y-8 animate-page">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between animate-fade-up">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-or">Dashboard admin</p>
          <h1 className="mt-3 text-4xl font-bold">{user?.email}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/produits" className="btn-secondary">Produits</Link>
          <Link to="/admin/commandes" className="btn-secondary">Commandes</Link>
          <button type="button" onClick={logout} className="btn-primary">Déconnexion</button>
        </div>
      </div>

      {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</p>}

      {/* Stat Cards */}
      <section className="grid gap-4 md:grid-cols-3">
        {statCards.map(({ label, value, icon, delay }) => (
          <article key={label} className={`stat-card p-6 animate-fade-up ${delay}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.3em] text-or">{label}</p>
              <span className="text-2xl">{icon}</span>
            </div>
            <h2 className="mt-4 text-5xl font-bold tabular-nums">{value}</h2>
          </article>
        ))}
      </section>

      {/* Latest Orders */}
      <section className="card-surface p-6 animate-fade-up delay-400">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Dernières commandes</h2>
          <Link to="/admin/commandes" className="text-sm font-semibold text-or hover:underline">Voir tout</Link>
        </div>
        <div className="mt-6 space-y-4">
          {stats.latestOrders.length === 0 && (
            <p className="text-sm text-[#6B6B6B] italic">Aucune commande pour le moment.</p>
          )}
          {stats.latestOrders.map((commande, i) => (
            <article key={commande.id} className={`border border-[#E8E8E8] bg-white p-4 animate-fade-up delay-${(i + 1) * 100}`}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{commande.client?.prenom} {commande.client?.nom}</p>
                  <p className="text-sm text-[#6B6B6B]">
                    {commande.client?.telephone} • {commande.client?.wilaya}
                    {commande.client?.commune ? ` — ${commande.client.commune}` : ""}
                  </p>
                </div>
                <span className="rounded-full bg-or/15 px-3 py-1 text-sm font-semibold text-or self-start sm:self-auto">
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
