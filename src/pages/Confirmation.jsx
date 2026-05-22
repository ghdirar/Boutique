import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Confirmation() {
  const orderId = sessionStorage.getItem("magsin-last-order-id") || "—";
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#f7f4ef] px-5 py-16">
      <div
        className={`w-full max-w-lg text-center transition-all duration-700 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Animated checkmark */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#c9a84c]/10 shadow-[0_0_0_12px_rgba(201,168,76,0.06)]">
          <svg className="h-12 w-12 text-[#c9a84c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="section-label mb-3 text-[#c9a84c]">Commande confirmée</p>
        <h1 className="font-serif text-4xl uppercase tracking-[0.08em] text-[#080808]">
          Merci pour votre achat !
        </h1>
        <p className="mt-5 text-sm leading-7 text-[#7a7368]">
          Votre commande <span className="font-bold text-[#080808]">#{orderId}</span> a bien été reçue.
          Notre équipe la prépare avec soin. Vous serez contacté(e) très prochainement.
        </p>

        {/* Steps info */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: "📦", label: "Commande reçue" },
            { icon: "🔧", label: "Préparation" },
            { icon: "🚚", label: "Livraison" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl bg-white p-4 shadow-sm border border-black/[0.03]">
              <p className="text-2xl">{s.icon}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7a7368]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/" className="btn-primary inline-flex">
            Retour à l'accueil
          </Link>
          <Link to="/catalogue" className="btn-secondary inline-flex">
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}
