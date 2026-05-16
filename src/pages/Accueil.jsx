import { Link } from "react-router-dom";
import CarteProduit from "../components/CarteProduit";
import Spinner from "../components/Spinner";
import useProduits from "../hooks/useProduits";

const categories = [
  {
    slug: "sacs-main",
    title: "Sac à la main",
    description: "L'elegance a portee de main. Notre collection iconique.",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1400&q=85",
  }
];

export default function Accueil() {
  const { produits, loading, error } = useProduits();
  const nouveautes = produits.slice(0, 4);
  const vedette = produits.slice(0, 4);

  return (
    <div className="bg-white">
      <section className="relative min-h-screen overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=2200&q=85"
          alt="Nouvelle collection La Votre"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative flex min-h-screen items-center justify-center px-5 text-center text-white">
          <div>
            <p className="text-[12px] uppercase tracking-[0.2em] animate-fade-up">Printemps - Ete 2026</p>
            <h1 className="mt-5 font-serif text-4xl font-normal uppercase tracking-[0.1em] text-white sm:text-6xl animate-fade-up delay-200">
              Nouvelle collection
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base font-light leading-8 text-white/90 animate-fade-up delay-300">
              Maroquinerie parisienne, lignes pures et details lumineux.
            </p>
            <Link
              to="/catalogue"
              className="mt-8 inline-flex border border-white bg-transparent px-10 py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 ease-in-out hover:bg-white hover:text-[#1A1A1A] animate-fade-up delay-400"
            >
              Decouvrir
            </Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-[#E8E8E8] bg-white py-4">
        <div className="flex w-max animate-marquee gap-10 text-[12px] uppercase tracking-[0.15em] text-[#1A1A1A]">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex gap-10">
              <span>Livraison Algerie</span>
              <span>•</span>
              <span>Retours 14 jours</span>
              <span>•</span>
              <span>Paiement securise</span>
              <span>•</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
        <h2 className="section-title animate-fade-up">Les nouveautes</h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-7 text-[#6B6B6B] animate-fade-up delay-150">
          Une selection de sacs aux finitions soignees.
        </p>

        <div className="mt-12">
          {loading && <Spinner label="Chargement des nouveautes..." />}
          {error && <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          {!loading && !error && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {nouveautes.map((produit) => (
                <CarteProduit key={produit.id} produit={produit} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-px bg-white px-5 py-20 lg:grid-cols-1 lg:px-10 max-w-5xl mx-auto">
        {categories.map((category) => (
          <Link 
            key={category.slug} 
            to={`/catalogue?categorie=${category.slug}`} 
            className="group relative h-[500px] overflow-hidden bg-[#F5F5F3] animate-fade-up delay-100"
          >
            <img
              src={category.image}
              alt={category.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 to-transparent" />
            <div className="relative flex h-full items-end p-8 text-white md:p-12">
              <div>
                <h3 className="font-serif text-3xl font-normal uppercase tracking-[0.1em] text-white">{category.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/85">{category.description}</p>
                <span className="mt-5 inline-block text-sm underline underline-offset-4">Decouvrir</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.4fr] lg:px-10">
        <div className="self-center animate-slide-left">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B]">Collection vedette</p>
          <h2 className="mt-4 font-serif text-3xl font-normal uppercase tracking-[0.1em] text-[#1A1A1A]">
            Les essentiels La Votre
          </h2>
          <p className="mt-6 text-sm leading-8 text-[#6B6B6B]">
            Des formes intemporelles, pensees pour accompagner le quotidien avec une elegance discrete.
          </p>
          <Link to="/catalogue" className="btn-secondary mt-8">
            Voir la collection
          </Link>
        </div>

        <div className="animate-slide-right delay-200">
          {loading && <Spinner label="Chargement..." />}
          {!loading && !error && (
            <div className="grid gap-8 sm:grid-cols-2">
              {vedette.map((produit) => (
                <CarteProduit key={produit.id} produit={produit} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
