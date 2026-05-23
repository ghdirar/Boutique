import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Confirmation() {
  const { t, lang } = useLanguage();
  const orderId = sessionStorage.getItem("magsin-last-order-id") || "—";
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
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

        <p className="section-label mb-3 text-[#c9a84c]">{t("commande_titre")}</p>
        <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-[0.08em] text-[#080808]">
          {t("merci")}
        </h1>
        <p className="mt-5 text-sm leading-7 text-[#7a7368]">
          {lang === "fr" ? (
            <>
              Votre commande <span className="font-bold text-[#080808]">#{orderId}</span> a bien été reçue.
              Notre équipe la prépare avec soin. Vous serez contacté(e) très prochainement.
            </>
          ) : (
            <>
              تم استلام طلبيتكِ رقم <span className="font-bold text-[#080808]">#{orderId}</span> بنجاح.
              يقوم فريقنا الآن بتحضيرها بكل حب وعناية، وسنتصل بكِ قريبًا لتأكيد الشحن.
            </>
          )}
        </p>

        {/* Steps info */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: "📦", label: t("etape_reception") },
            { icon: "🔧", label: t("etape_expedition") },
            { icon: "🚚", label: t("etape_remise") },
          ].map((s, i) => (
            <div key={i} className="rounded-xl bg-white p-4 shadow-sm border border-black/[0.03]">
              <p className="text-2xl">{s.icon}</p>
              <p className="mt-2 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7a7368]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/" className="btn-primary inline-flex">
            {t("retour_accueil")}
          </Link>
          <Link to="/catalogue" className="btn-secondary inline-flex">
            {t("continuer_achats")}
          </Link>
        </div>
      </div>
    </div>
  );
}
