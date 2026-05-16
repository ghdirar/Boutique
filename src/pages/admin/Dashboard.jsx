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

        const [commandesCount, attenteCount, produitsCount, latestSnapshot] = await Promise.all([
          getCountFromServer(collection(db, "commandes")),
          getCountFromServer(query(collection(db, "commandes"), where("statut", "==", "en attente"))),
          getCountFromServer(collection(db, "produits")),
          getDocs(query(collection(db, "commandes"), orderBy("date", "desc"), limit(5))),
        ]);

        setStats({
          totalCommandes: commandesCount.data().count,
          commandesEnAttente: attenteCount.data().count,
          totalProduits: produitsCount.data().count,
          latestOrders: latestSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        });
      } catch (fetchError) {
        setError("Impossible de charger le tableau de bord.");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <Spinner label="Chargement du dashboard..." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-or">Dashboard admin</p>
          <h1 className="mt-3 text-4xl font-bold">Bienvenue {user?.email}</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/admin/produits" className="btn-secondary">
            Produits
          </Link>
          <Link to="/admin/commandes" className="btn-secondary">
            Commandes
          </Link>
          <button type="button" onClick={logout} className="btn-primary">
            Déconnexion
          </button>
        </div>
      </div>

      {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</p>}

      <section className="grid gap-4 md:grid-cols-3">
        <article className="card-surface rounded-[2rem] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-or">Commandes</p>
          <h2 className="mt-4 text-4xl font-bold">{stats.totalCommandes}</h2>
        </article>
        <article className="card-surface rounded-[2rem] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-or">En attente</p>
          <h2 className="mt-4 text-4xl font-bold">{stats.commandesEnAttente}</h2>
        </article>
        <article className="card-surface rounded-[2rem] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-or">Produits</p>
          <h2 className="mt-4 text-4xl font-bold">{stats.totalProduits}</h2>
        </article>
      </section>

      <section className="card-surface rounded-[2rem] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Dernières commandes</h2>
          <Link to="/admin/commandes" className="text-sm font-semibold text-or">
            Voir tout
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {stats.latestOrders.map((commande) => (
            <article key={commande.id} className="rounded-3xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{commande.client?.nom}</p>
                  <p className="text-sm text-white/60">
                    {commande.client?.telephone} • {commande.client?.wilaya}
                  </p>
                </div>
                <div className="text-sm">
                  <span className="rounded-full bg-or/15 px-3 py-1 font-semibold text-or">{commande.statut}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
