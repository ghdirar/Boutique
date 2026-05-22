import { useState } from "react";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "Collections",
    links: [
      { label: "Sac à la main", to: "/catalogue?categorie=sacs-main" },
      { label: "Nouveautés", to: "/catalogue" },
      { label: "Meilleures ventes", to: "/catalogue" },
    ],
  },
  {
    title: "Service client",
    links: [
      { label: "Livraison en Algérie", modalId: "livraison" },
      { label: "Comment commander ?", modalId: "commander" },
      { label: "Nous contacter", modalId: "contact" },
    ],
  },
  {
    title: "La Boutique",
    links: [
      { label: "Notre histoire", modalId: "histoire" },
      { label: "Savoir-faire artisanal", modalId: "savoir-faire" },
      { label: "Conditions générales", modalId: "cgu" },
    ],
  },
];

// Real social media icons as SVGs
const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/lavotre_dz",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@lavotre_dz",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

const policies = [
  "📦 Livraison dans toute l'Algérie",
  "💰 Paiement à la livraison",
  "✨ Qualité artisanale premium",
  "📞 Support WhatsApp & Instagram",
  "🔥 3 articles achetés = Livraison gratuite  "];

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const renderModalContent = () => {
    switch (activeModal) {
      case "livraison":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a84c]">Service Client</span>
              <h3 className="mt-2 font-serif text-2xl font-normal uppercase tracking-[0.1em]">Livraison en Algérie</h3>
            </div>
            <div className="my-4 border-b border-black/[0.08]" />
            <div className="space-y-4 text-sm leading-relaxed text-[#555]">
              <p>
                Nous livrons vos commandes d'exception directement à votre domicile sur l'ensemble des <strong>58 wilayas d'Algérie</strong>.
              </p>
              <div className="rounded-2xl bg-black/[0.03] p-4 space-y-3">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#080808]">
                  <span>Zone</span>
                  <span>Tarif</span>
                  <span>Délai</span>
                </div>
                <div className="border-t border-black/[0.05] pt-2" />
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-[#080808]">Alger & Environs</span>
                  <span className="text-[#c9a84c] font-bold">400 DA</span>
                  <span className="text-white bg-[#080808] px-2 py-0.5 rounded text-[10px]">24h</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-[#080808]">Grandes Wilayas</span>
                  <span className="text-[#c9a84c] font-bold">600 DA</span>
                  <span className="text-[#666]">48h</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-[#080808]">Sud & Wilayas éloignées</span>
                  <span className="text-[#c9a84c] font-bold">800 DA</span>
                  <span className="text-[#666]">72h</span>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-[#c9a84c]/10 p-4 border border-[#c9a84c]/20">
                <span className="text-lg">🎁</span>
                <p className="text-xs text-[#8c6b24] leading-relaxed">
                  <strong>3 articles achetés = Livraison gratuite !</strong> L'offre s'applique automatiquement lors de la validation de votre panier.
                </p>
              </div>
              <p className="text-xs text-[#777] italic text-center">
                * Le paiement s'effectue exclusivement en espèces (main à main) lors de la réception de votre colis.
              </p>
            </div>
          </div>
        );
      case "tailles":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a84c]">Ergonomie</span>
            </div>
            <div className="my-4 border-b border-black/[0.08]" />
            <div className="space-y-4 text-sm text-[#555]">
              <p className="text-center">
                Trouvez le format idéal pour vos besoins parmi nos créations phares.
              </p>
              <div className="space-y-3">
                {[
                  {
                    name: "Format Petit / Mini Bag",
                    dims: "18 x 13 x 8 cm",
                    desc: "Idéal pour vos sorties légères. Accueille aisément votre smartphone (tous formats), clés, rouge à lèvres et porte-cartes.",
                    icon: "👜"
                  },
                  {
                    name: "Format Moyen / Daily Bag",
                    dims: "24 x 18 x 10 cm",
                    desc: "Le compagnon parfait du quotidien. Conçu pour accueillir vos essentiels, une petite tablette, maquillage, lunettes de soleil et portefeuille.",
                    icon: "💼"
                  },
                  {
                    name: "Format Grand / Tote Bag / Cabas",
                    dims: "38 x 28 x 15 cm",
                    desc: "Un volume généreux pour les journées actives ou le voyage. Permet de transporter un ordinateur portable jusqu'à 14 pouces, des documents A4 et vos effets personnels.",
                    icon: "🎒"
                  }
                ].map((size) => (
                  <div key={size.name} className="flex gap-4 p-3 rounded-2xl bg-white shadow-sm border border-black/[0.02]">
                    <span className="text-2xl mt-1">{size.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline flex-wrap">
                        <h4 className="font-semibold text-xs uppercase tracking-wider text-[#080808]">{size.name}</h4>
                        <span className="text-[11px] font-bold text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-0.5 rounded">{size.dims}</span>
                      </div>
                      <p className="mt-1.5 text-xs text-[#666] leading-relaxed">{size.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "commander":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a84c]">Aide à l'achat</span>
              <h3 className="mt-2 font-serif text-2xl font-normal uppercase tracking-[0.1em]">Comment commander ?</h3>
            </div>
            <div className="my-4 border-b border-black/[0.08]" />
            <div className="space-y-5 text-sm text-[#555]">
              <p className="text-center text-xs">
                Commander votre pièce de maroquinerie n'a jamais été aussi simple. Suivez ces 3 étapes :
              </p>
              <div className="space-y-4">
                {[
                  {
                    step: "01",
                    title: "Sélectionnez votre création",
                    desc: "Parcourez nos collections, choisissez le modèle qui vous inspire et sélectionnez la couleur de cuir souhaitée."
                  },
                  {
                    step: "02",
                    title: "Remplissez vos informations",
                    desc: "Validez votre panier et complétez notre formulaire simplifié avec vos coordonnées : Nom, Téléphone et votre Wilaya."
                  },
                  {
                    step: "03",
                    title: "Confirmation téléphonique & Livraison",
                    desc: "Notre service client vous appelle sous 24h pour valider la commande. Votre colis est expédié et vous payez cash à sa réception."
                  }
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <span className="font-serif text-2xl font-bold text-[#c9a84c]/50">{s.step}</span>
                    <div>
                      <h4 className="font-semibold text-xs uppercase tracking-wider text-[#080808]">{s.title}</h4>
                      <p className="mt-1 text-xs text-[#666] leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a84c]">Nous Contacter</span>
              <h3 className="mt-2 font-serif text-2xl font-normal uppercase tracking-[0.1em]">Assistance</h3>
            </div>
            <div className="my-4 border-b border-black/[0.08]" />
            <div className="space-y-5 text-sm text-[#555]">
              <p className="text-center text-xs leading-relaxed">
                Notre équipe est à votre entière disposition pour répondre à toutes vos questions sur nos créations ou vos commandes.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href="https://www.instagram.com/lavotre_dz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-black/[0.02] hover:border-[#c9a84c]/30 transition group"
                >
                  <span className="text-xl">📸</span>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#080808] group-hover:text-[#c9a84c]">Instagram</h4>
                    <p className="text-xs text-[#777]">@lavotre_dz</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/213555123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-black/[0.02] hover:border-[#25D366]/30 transition group"
                >
                  <span className="text-xl">💬</span>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#080808] group-hover:text-[#25D366]">WhatsApp</h4>
                    <p className="text-xs text-[#777]">+213 555 12 34 56</p>
                  </div>
                </a>
              </div>
              <div className="rounded-2xl bg-[#080808] p-4 text-white text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/40">📍 Atelier</span>
                  <span className="font-semibold text-white/90">Alger, Algérie</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">✉️ Email</span>
                  <span className="font-semibold text-white/90">contact@lavotre.dz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">🕒 Horaires</span>
                  <span className="font-semibold text-white/90">9h00 - 18h00 (Sam - Jeu)</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "histoire":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="mt-2 font-serif text-2xl font-normal uppercase tracking-[0.1em]">Notre Histoire</h3>
            </div>
            <div className="my-4 border-b border-black/[0.08]" />
            <div className="space-y-4 text-sm leading-relaxed text-[#555] text-justify text-xs">
              <p>
                Née en Algérie d'une passion inconditionnelle pour les matières nobles et le design contemporain, <strong>La Votre</strong> est une maison de maroquinerie de luxe de nouvelle génération.
              </p>
              <p>
                Notre philosophie réside dans l'alliance de lignes sculpturales modernes et de l'authenticité de l'artisanat traditionnel. Nous imaginons des silhouettes intemporelles, affranchies des tendances éphémères, pensées pour traverser le temps avec grâce.
              </p>
              <blockquote className="border-l-2 border-[#c9a84c] pl-4 italic text-[#7a7368] text-xs py-1">
                "Nous ne créons pas de simples accessoires, mais des compagnons de vie qui portent en eux l'excellence du détail."
              </blockquote>
              <p>
                Aujourd'hui, chaque collection témoigne de notre exigence absolue quant à la sélection des peaux et de la rigueur de nos finitions, faisant de chaque sac une œuvre d'art unique.
              </p>
            </div>
          </div>
        );
      case "savoir-faire":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a84c]">Excellence</span>
              <h3 className="mt-2 font-serif text-2xl font-normal uppercase tracking-[0.1em]">Savoir-faire Artisanal</h3>
            </div>
            <div className="my-4 border-b border-black/[0.08]" />
            <div className="space-y-4 text-sm leading-relaxed text-[#555] text-justify">
              <p>
                Derrière chaque création signée <strong>La Votre</strong> se cachent des mains expertes de maîtres artisans maroquiniers dévoués à l'excellence.
              </p>
              <div className="grid gap-3">
                {[
                  { title: "Cuirs d'exception", desc: "Cuirs de premier choix tannés de manière naturelle pour garantir leur patine unique et leur longévité." },
                  { title: "Finitions manuelles", desc: "Chaque découpe, couture, assemblage et teinture de tranche est entièrement réalisé à la main." },
                  { title: "Bouclerie en laiton", desc: "Fermoirs et ferrures en laiton massif pour un éclat persistant et une robustesse incomparable." }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-2xl border border-black/[0.02]">
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-[#080808]">{item.title}</h4>
                    <p className="mt-1 text-[11px] text-[#666] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "cgu":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a84c]">Légal</span>
              <h3 className="mt-2 font-serif text-2xl font-normal uppercase tracking-[0.1em]">Conditions Générales</h3>
            </div>
            <div className="my-4 border-b border-black/[0.08]" />
            <div className="space-y-4 text-xs leading-relaxed text-[#555] max-h-[40vh] overflow-y-auto pr-2">
              <p>
                Bienvenue sur le site officiel de <strong>La Votre</strong>. En passant commande, vous acceptez pleinement nos conditions générales de vente :
              </p>
              <div>
                <h4 className="font-bold text-[#080808] uppercase text-[10px] tracking-wider">1. Modalités de Paiement</h4>
                <p className="mt-1">
                  Le paiement s'effectue exclusivement en espèces (DA) lors de la livraison en main à main de votre colis. Aucune transaction bancaire en ligne n'est requise.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-[#080808] uppercase text-[10px] tracking-wider">2. Confirmation de Commande</h4>
                <p className="mt-1">
                  Toute commande fait l'objet d'un appel téléphonique de confirmation sous 24h à 48h. Sans réponse ou confirmation verbale de votre part après plusieurs tentatives, la commande sera annulée d'office.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-[#080808] uppercase text-[10px] tracking-wider">3. Retours et Échanges</h4>
                <p className="mt-1">
                  Pas de retours ou échanges acceptés sauf si l'article présente un défaut de fabrication flagrant (signalé à la livraison lors de la remise en main propre).
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="bg-[#080808] text-white/80">
      {/* ── TOP SECTION ── */}
      <div className="mx-auto max-w-[1400px] px-5 pt-16 pb-12 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + Newsletter */}
          <div>
            <p className="font-serif text-2xl font-medium uppercase tracking-[0.22em] text-white">La Votre</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#c9a84c]">Elle est déjà la votre</p>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/50">
              Maroquinerie d'exception fabriquée avec soin. Livraison partout en Algérie avec paiement à la réception.
            </p>

            {/* Key policies */}
            <div className="mt-6 space-y-2">
              {policies.map((p) => (
                <p key={p} className="text-[12px] text-white/40">{p}</p>
              ))}
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                Recevoir nos nouveautés
              </p>
              <div className="flex overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                <input
                  type="email"
                  placeholder="Votre email..."
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30"
                />
                <button
                  type="button"
                  className="m-1 rounded-full bg-[#c9a84c] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#e2c46f]"
                >
                  OK
                </button>
              </div>
            </div>

            {/* Real social links */}
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-all duration-300 hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/10 hover:text-[#c9a84c]"
                >
                  {s.icon}
                </a>
              ))}
              {/* WhatsApp */}
              <a
                href="https://wa.me/213555123456"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-all duration-300 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#25D366]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">{col.title}</p>
              <div className="space-y-3">
                {col.links.map((link) => {
                  if (link.modalId) {
                    return (
                      <button
                        key={link.label}
                        type="button"
                        onClick={() => setActiveModal(link.modalId)}
                        className="block text-left text-sm text-white/55 transition-colors duration-200 hover:text-[#c9a84c] w-full bg-transparent border-none p-0 cursor-pointer outline-none"
                      >
                        {link.label}
                      </button>
                    );
                  }
                  return link.to.startsWith("http") ? (
                    <a
                      key={link.label}
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-white/55 transition-colors duration-200 hover:text-[#c9a84c]"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="block text-sm text-white/55 transition-colors duration-200 hover:text-[#c9a84c]"
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/[0.05] py-5">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-5 text-center sm:flex-row lg:px-10">
          <p className="text-[11px] text-white/30">© 2026 La Votre. Tous droits réservés.</p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/30">💰 Paiement à la livraison</span>
            <span className="text-white/20">•</span>
            <a
              href="https://www.instagram.com/lavotre_dz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-white/30 transition hover:text-[#c9a84c]"
            >
              @lavotre_dz
            </a>
          </div>
        </div>
      </div>

      {/* ── CUSTOM INFORMATION MODALS (SERVICE CLIENT / LA MAISON) ── */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-fade-in" 
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="relative w-full max-w-lg overflow-hidden rounded-[24px] bg-[#f7f4ef] text-[#080808] shadow-[0_24px_64px_rgba(0,0,0,0.5)] border border-white/10 p-6 sm:p-8 max-h-[85vh] overflow-y-auto transform transition-all duration-300 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-[#080808] transition duration-200 cursor-pointer"
              aria-label="Fermer"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Body */}
            <div className="mt-2">
              {renderModalContent()}
            </div>

            {/* Modal Footer (Action Pill) */}
            <div className="mt-6 flex justify-end border-t border-black/[0.05] pt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-full bg-[#080808] hover:bg-[#c9a84c] text-white px-5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] transition duration-200 cursor-pointer shadow-[0_4px_12px_rgba(8,8,8,0.1)] hover:shadow-[0_4px_16px_rgba(201,168,76,0.3)]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
