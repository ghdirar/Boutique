import { Link } from "react-router-dom";
import CarteProduit from "../components/CarteProduit";
import Spinner from "../components/Spinner";
import useProduits from "../hooks/useProduits";

const categories = [
  { slug: "robes", label: "Robes" },
  { slug: "t-shirts", label: "T-shirts" },
  { slug: "pantalons", label: "Pantalons" },
  { slug: "vestes", label: "Vestes" },
];

export default function Accueil() {
  const { produits, loading, error } = useProduits();
  const nouveautes = produits.slice(0, 4);

  return (
    <div className="space-y-16">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-hero px-6 py-16 shadow-luxe sm:px-10 lg:px-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-or">Collection 2026</p>
              <h1 className="max-w-3xl text-5xl font-bold leading-tight sm:text-6xl">
                Une boutique de vêtements élégante, moderne et prête à vendre.
              </h1>
              <p className="max-w-2xl text-lg text-white/70">
                Découvrez des pièces raffinées, ajoutez-les au panier et envoyez les commandes
                directement à votre administration via Firebase.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/catalogue" className="btn-primary">
                Voir la collection
              </Link>
              <Link to="/panier" className="btn-secondary">
                Voir le panier
              </Link>
            </div>
          </div>

          <div className="card-surface overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"
              alt="Collection vêtement"
              className="h-full min-h-[360px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-or">Nouveautés</p>
            <h2 className="section-title">Les 4 derniers produits</h2>
          </div>
          <Link to="/catalogue" className="btn-secondary">
            Voir tout le catalogue
          </Link>
        </div>

        {loading && <Spinner label="Chargement des nouveautés..." />}
        {error && <p className="rounded-3xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {nouveautes.map((produit) => (
              <CarteProduit key={produit.id} produit={produit} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-or">Catégories</p>
          <h2 className="section-title">Explorer par univers</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/catalogue?categorie=${category.slug}`}
              className="card-surface group rounded-[1.75rem] p-6 transition hover:-translate-y-1 hover:border-or"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-or">Catégorie</p>
              <h3 className="mt-4 text-3xl font-semibold">{category.label}</h3>
              <p className="mt-3 text-white/65">Découvrez la sélection {category.label.toLowerCase()}.</p>
              <span className="mt-6 inline-block text-sm font-semibold text-white/70 group-hover:text-or">
                Explorer →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
