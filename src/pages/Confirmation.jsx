import { Link, useLocation } from "react-router-dom";

export default function Confirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId || sessionStorage.getItem("magsin-last-order-id");

  return (
    <div className="mx-auto max-w-3xl px-5 py-20 text-center animate-page">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] animate-fade-up">Confirmation</p>
      <h1 className="mt-5 font-serif text-3xl font-normal uppercase tracking-[0.1em] text-[#1A1A1A] animate-fade-up delay-150">
        Votre commande est confirmee
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#6B6B6B] animate-fade-up delay-300">
        Nous vous contacterons sous 24h pour confirmer les details de livraison.
      </p>

      <div className="mx-auto mt-10 max-w-md bg-[#F5F5F3] p-8 animate-scale-in delay-400">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">Numero de commande</p>
        <p className="mt-3 text-xl text-[#1A1A1A]">{orderId || "En cours de generation"}</p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-up delay-500">
        <Link to="/catalogue" className="btn-primary">
          Continuer vos achats
        </Link>
        <Link to="/" className="btn-secondary">
          Retour accueil
        </Link>
      </div>
    </div>
  );
}
