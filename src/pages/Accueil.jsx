import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CarteProduit from "../components/CarteProduit";
import Spinner from "../components/Spinner";
import useProduits from "../hooks/useProduits";
import { useLanguage } from "../context/LanguageContext";

const heroImages = [
  // 1. Gros plan sac en cuir structuré beige/crème (Sac à la main)
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=2400&q=85",
  
  // 2. Sac à main structuré marron de luxe (Sac à la main)
  "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=2400&q=85",
  
  // 3. Sac à main beige haut de gamme (Sac à la main)
  "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=2400&q=85",
  
  // 4. Sac minimaliste noir élégant (Sac à la main)
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=2400&q=85",
  
  // 5. Sac à main classique marron grainé (Sac à la main)
  "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=2400&q=85",
  
  // 6. Sac à main beige et or structuré (Sac à la main)
  "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=2400&q=85",
  
  // 7. Sac à main bordeaux en cuir lisse (Sac à la main)
  "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=2400&q=85"
];
export default function Accueil() {
  const { produits, loading, error } = useProduits();
  const { t, lang } = useLanguage();
  const nouveautes = produits.slice(0, 4);
  const vedette = produits.slice(0, 4);
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const marqueeItems = [
    t("livraison_algerie"), "•", t("paiement_livraison"), "•", t("qualite_premium"), "•",
    t("artisanat_luxe"), "•", t("livraison_algerie"), "•", t("paiement_livraison"), "•",
    t("qualite_premium"), "•", t("artisanat_luxe"), "•",
  ];

  const categories = [
    {
      slug: "sacs-main",
      title: t("sacs_main"),
      description: lang === "fr" 
        ? "L'élégance à portée de main. Notre collection iconique pensée pour les femmes modernes."
        : "الأناقة بين يديكِ. تشكيلتنا الأيقونية المصممة خصيصًا للمرأة العصرية.",
      image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1400&q=85",
      badge: lang === "fr" ? "Collection 2026" : "تشكيلة 2026",
    },
  ];

  const features = [
    { icon: "🚚", title: t("feat_delivery_title"), sub: t("feat_delivery_sub") },
    { icon: "💰", title: t("feat_payment_title"), sub: t("feat_payment_sub") },
    { icon: "✨", title: t("feat_craft_title"), sub: t("feat_craft_sub") },
    { icon: "📞", title: t("feat_support_title"), sub: t("feat_support_sub") },
  ];

  return (
    <div className="bg-[#f7f4ef]">

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {heroImages.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Nouvelle collection La Votre ${index + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentHero ? "opacity-100 animate-pulse-slow" : "opacity-0"
            }`}
            style={{ transformOrigin: "center center" }}
          />
        ))}
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Hero content glass card */}
        <div className="relative z-10 w-full max-w-3xl px-5 text-center">
          <div
            className="rounded-[40px] border border-white/10 bg-black/25 px-8 py-14 backdrop-blur-md shadow-2xl animate-scale-in sm:px-16 sm:py-20"
          >
            <p className="section-label text-[#e2c46f] animate-fade-up">{t("printemps_ete")}</p>
            <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-7xl font-medium uppercase tracking-[0.1em] text-white animate-fade-up delay-150 leading-tight">
              {lang === "fr" ? (
                <>Nouvelle<br />Collection</>
              ) : (
                <>التشكيلة<br />الجديدة</>
              )}
            </h1>
            <p className="mx-auto mt-6 max-w-md text-sm font-light leading-8 text-white/70 animate-fade-up delay-250">
              {t("hero_desc")}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-up delay-400">
              <Link
                to="/catalogue"
                className="btn-gold text-[13px]"
              >
                {t("decouvrir_coll")}
              </Link>
              <Link
                to="/catalogue?categorie=sacs-main"
                className="rounded-full border-2 border-white/30 px-8 py-[13px] text-[12px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                {t("sacs_main_btn")}
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-10 flex flex-col items-center gap-2 animate-fade-up delay-600">
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">{t("defiler")}</span>
            <div className="h-10 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MARQUEE TICKER
      ══════════════════════════════════════════════════════ */}
      <section className="overflow-hidden border-y border-black/[0.05] bg-white py-3">
        <div className={`flex w-max animate-marquee gap-12 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a7368] ${lang === "ar" ? "flex-row-reverse" : ""}`}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className={item === "•" ? "text-[#c9a84c]" : ""}>{item}</span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES BAR
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px bg-black/[0.04] px-0 lg:grid-cols-4">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`flex flex-col items-center gap-2 bg-[#f7f4ef] px-6 py-8 text-center animate-fade-up delay-${(i + 1) * 100}`}
          >
            <span className="text-2xl">{f.icon}</span>
            <p className="text-sm font-semibold text-[#080808]">{f.title}</p>
            <p className="text-[12px] text-[#7a7368]">{f.sub}</p>
          </div>
        ))}
      </section>

      {/* ══════════════════════════════════════════════════════
          NOUVEAUTÉS
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10">
        <div className="mb-14 text-center animate-fade-up">
          <p className="section-label mb-3">{t("derniers_arrivages")}</p>
          <h2 className="section-title section-title--center">{t("les_nouveautes")}</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#7a7368]">
            {t("nouveautes_desc")}
          </p>
        </div>

        {loading && <Spinner label={t("chargement")} />}
        {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {nouveautes.map((produit) => (
              <CarteProduit key={produit.id} produit={produit} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center animate-fade-up">
          <Link to="/catalogue" className="btn-secondary inline-flex">{t("voir_catalogue")}</Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CATEGORY SPOTLIGHT
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1400px] px-5 pb-24 lg:px-10">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/catalogue?categorie=${cat.slug}`}
            className="group relative block overflow-hidden rounded-[32px] animate-fade-up"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="h-[500px] w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.04] sm:h-[600px]"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

            {/* Content */}
            <div className={`absolute inset-0 flex flex-col justify-end p-8 text-white sm:p-14 ${lang === "ar" ? "text-right items-end" : ""}`}>
              <span className="badge badge-or mb-4 self-start">{cat.badge}</span>
              <h2 className="font-serif text-4xl font-medium uppercase tracking-[0.08em] sm:text-5xl">{cat.title}</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/75">{cat.description}</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="rounded-full bg-white text-[#080808] px-6 py-3 text-[12px] font-bold uppercase tracking-[0.2em] transition-all duration-300 group-hover:bg-[#c9a84c] group-hover:text-white cursor-pointer">
                  {lang === "fr" ? "Découvrir" : "اكتشفي الآن"}
                </span>
                <span className="text-sm text-white/60 transition-colors group-hover:text-white">
                  {lang === "ar" ? "←" : "→"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* ══════════════════════════════════════════════════════
          VEDETTE — editorial split
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto grid max-w-[1400px] gap-16 px-5 pb-28 lg:grid-cols-[0.85fr_1.4fr] lg:items-start lg:px-10">
        <div className="self-center animate-slide-left">
          <p className="section-label mb-4">{t("selection_curatee")}</p>
          <h2 className="section-title">{t("les_essentiels")}</h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-[#7a7368]">
            {t("essentiels_desc")}
          </p>
          <Link to="/catalogue" className="btn-primary mt-8 inline-flex">
            {t("voir_collection")}
          </Link>
          {/* Trust badges */}
          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              { icon: "⭐", val: "4.9/5", label: t("note_moyenne") },
              { icon: "📦", val: "+200", label: t("commandes_mois") },
            ].map((b) => (
              <div key={b.label} className="rounded-2xl border border-black/[0.05] bg-white p-4 text-center shadow-sm">
                <p className="text-xl">{b.icon}</p>
                <p className="mt-1 text-lg font-bold text-[#080808]">{b.val}</p>
                <p className="text-[11px] text-[#7a7368]">{b.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-slide-right delay-200">
          {loading && <Spinner label={t("chargement")} />}
          {!loading && !error && (
            <div className="grid gap-5 sm:grid-cols-2">
              {vedette.map((produit) => (
                <CarteProduit key={produit.id} produit={produit} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="mx-5 mb-24 overflow-hidden rounded-[32px] bg-[#080808] lg:mx-10 animate-fade-up">
        <div className="grid lg:grid-cols-2">
          <div className={`flex flex-col justify-center px-10 py-14 sm:px-16 ${lang === "ar" ? "text-right items-end" : ""}`}>
            <p className="section-label text-[#c9a84c] mb-4">{t("offre_exclusive")}</p>
            <h2 className="font-serif text-4xl font-medium uppercase tracking-[0.08em] text-white sm:text-5xl leading-tight">
              {lang === "fr" ? (
                <>Livraison<br />Offerte</>
              ) : (
                <>توصيل<br />مجاني</>
              )}
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">
              {t("livraison_offerte_desc")}
            </p>
            <Link to="/catalogue" className="btn-gold mt-8 self-start text-[13px]">
              {t("commander_maintenant")}
            </Link>
          </div>
          <div className="relative hidden overflow-hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
              alt="Collection sacs"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/40 to-transparent" />
          </div>
        </div>
      </section>

    </div>
  );
}
