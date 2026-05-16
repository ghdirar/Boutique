import { Link, useLocation } from "react-router-dom";

export default function Confirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId || sessionStorage.getItem("magsin-last-order-id");

  return (
    <div className="mx-auto max-w-3xl">
      <section className="card-surface rounded-[2rem] p-8 text-center sm:p-12">
        <p className="text-sm uppercase tracking-[0.35em] text-or">Merci</p>
        <h1 className="mt-4 text-4xl font-bold">Votre commande a bien été enregistrée</h1>
        <p className="mt-4 text-white/70">
          Nous vous contacterons dans 24h pour confirmer les détails de livraison.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-3xl border border-or/30 bg-or/10 p-5">
          <p className="text-sm text-white/60">Numéro de commande</p>
          <p className="mt-2 text-2xl font-bold text-or">{orderId || "En cours de génération"}</p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/catalogue" className="btn-primary">
            Continuer vos achats
          </Link>
          <Link to="/" className="btn-secondary">
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </div>
  );
}
