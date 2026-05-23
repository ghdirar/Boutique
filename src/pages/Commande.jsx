import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { usePanier } from "../context/PanierContext";
import { db } from "../firebase";
import { wilayasCommunes, wilayas } from "../data/communesAlgerie";
import { useLanguage } from "../context/LanguageContext";

function formatPrice(value, lang) {
  return `${Number(value).toLocaleString("fr-FR")} ${lang === "ar" ? "د.ج" : "DA"}`;
}

const initialForm = { prenom: "", nom: "", telephone: "", email: "", adresse: "", wilaya: "", commune: "" };

function FieldLabel({ children }) {
  return (
    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a7368]">
      {children}
    </span>
  );
}

// ── Send notification email via EmailJS REST API
async function sendOrderNotification({ numero, client, articles, total, lang }) {
  const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.info("EmailJS non configuré — notification ignorée.");
    return;
  }

  const articlesText = articles
    .map((a) => `• ${a.nom} (${a.couleur}) x${a.quantite} = ${formatPrice(a.prix * a.quantite, lang)}`)
    .join("\n");

  try {
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: "ghdirar@gmail.com",
          order_numero: numero,
          client_prenom: client.prenom,
          client_nom: client.nom,
          client_telephone: client.telephone,
          client_email: client.email || "—",
          client_wilaya: client.wilaya,
          client_commune: client.commune,
          client_adresse: client.adresse,
          articles_text: articlesText,
          total_price: formatPrice(total, "fr"),
          order_date: new Date().toLocaleString("fr-DZ"),
        },
      }),
    });
  } catch (err) {
    console.error("Erreur envoi email:", err);
  }
}

export default function Commande() {
  const navigate = useNavigate();
  const { articles, total, viderPanier } = usePanier();
  const { t, lang } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalArticles = articles.reduce((acc, item) => acc + item.quantite, 0);
  const livraisonOfferte = totalArticles >= 3;

  const communes = form.wilaya ? (wilayasCommunes[form.wilaya] || []) : [];

  const steps = [
    { id: 1, label: t("caddie") },
    { id: 2, label: t("etape_livraison") },
    { id: 3, label: t("etape_commande") },
  ];

  const canSubmit = useMemo(
    () =>
      form.prenom.trim() &&
      form.nom.trim() &&
      form.telephone.trim() &&
      form.wilaya.trim() &&
      form.commune.trim(),
    [form],
  );

  if (articles.length === 0) return <Navigate to="/panier" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((curr) => ({ ...curr, [name]: value, ...(name === "wilaya" ? { commune: "" } : {}) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const numero = `CMD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

      const clientData = {
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        telephone: form.telephone.trim(),
        email: form.email.trim(),
        adresse: form.adresse.trim(),
        wilaya: form.wilaya,
        commune: form.commune,
      };

      // 1️⃣ Save to Firestore
      const docRef = await addDoc(collection(db, "commandes"), {
        numero,
        client: clientData,
        articles,
        sousTotal: total,
        fraisLivraison: 0,
        total,
        statut: "en attente",
        date: serverTimestamp(),
      });

      // 2️⃣ Send notification email
      sendOrderNotification({
        numero: numero || docRef.id,
        client: clientData,
        articles,
        total,
        lang,
      });

      sessionStorage.setItem("magsin-last-order-id", numero || docRef.id);
      viderPanier();
      navigate("/confirmation", { replace: true, state: { orderId: numero || docRef.id } });
    } catch {
      setError(lang === "fr" ? "Impossible d'enregistrer la commande. Réessayez." : "حدث خطأ أثناء حفظ الطلبية. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      {/* Progress stepper */}
      <div className="border-b border-black/[0.05] bg-white px-5 py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-0">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className="progress-step">
                <div className={`progress-step-dot ${step.id === 2 ? "active" : step.id < 2 ? "done" : "pending"}`}>
                  {step.id < 2 ? "✓" : step.id}
                </div>
                <span className={`hidden text-[11px] font-semibold uppercase tracking-[0.15em] sm:block ${step.id === 2 ? "text-[#080808]" : step.id < 2 ? "text-[#c9a84c]" : "text-[#a09a91]"}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-3 h-[1px] w-12 bg-black/[0.08] sm:w-20`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-12 lg:grid-cols-[1fr_380px] lg:px-10 animate-page">

        {/* ── FORM ── */}
        <section className="animate-slide-left">
          <h1 className="font-serif text-3xl uppercase tracking-[0.1em] text-[#080808]">
            {t("commande_titre")}
          </h1>
          <p className="mt-2 text-sm text-[#7a7368]">
            {lang === "fr" 
              ? "Prénom, Nom, Téléphone, Wilaya et Commune sont requis."
              : "يرجى إدخال الاسم، اللقب، الهاتف، الولاية والبلدية لإتمام طلبكِ."}
          </p>

          {/* Paiement à la livraison banner */}
          <div className={`mt-6 flex items-center gap-3 rounded-2xl border border-[#c9a84c]/20 bg-[#c9a84c]/5 px-5 py-4 ${lang === "ar" ? "text-right" : ""}`}>
            <span className="text-2xl">💰</span>
            <div>
              <p className="text-sm font-semibold text-[#080808]">{t("paiement_cash")}</p>
              <p className="text-xs text-[#7a7368]">{t("paiement_cash_desc")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <FieldLabel>{t("prenom")} *</FieldLabel>
                <input name="prenom" value={form.prenom} onChange={handleChange} className="input-base" required placeholder={lang === "fr" ? "Votre prénom" : "الاسم الأول"} />
              </label>
              <label className="block">
                <FieldLabel>{t("nom")} *</FieldLabel>
                <input name="nom" value={form.nom} onChange={handleChange} className="input-base" required placeholder={lang === "fr" ? "Votre nom" : "اللقب"} />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <FieldLabel>{t("telephone")} *</FieldLabel>
                <input name="telephone" type="tel" value={form.telephone} onChange={handleChange} className="input-base" required placeholder="0xxx xxx xxx" />
              </label>
              <label className="block">
                <FieldLabel>{t("email")}</FieldLabel>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="input-base" placeholder="your@email.com" />
              </label>
            </div>

            <label className="block">
              <FieldLabel>{t("adresse_complete")}</FieldLabel>
              <textarea name="adresse" value={form.adresse} onChange={handleChange} rows="3" className="input-base resize-none" placeholder={lang === "fr" ? "N° et nom de rue, quartier... (optionnel)" : "رقم الباب، اسم الشارع، الحي... (اختياري)"} />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <FieldLabel>{t("wilaya")} *</FieldLabel>
                <select name="wilaya" value={form.wilaya} onChange={handleChange} className="input-base cursor-pointer" required>
                  <option value="">{t("choisir_wilaya")}</option>
                  {wilayas.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </label>
              <label className="block">
                <FieldLabel>{t("commune")} *</FieldLabel>
                <select name="commune" value={form.commune} onChange={handleChange} className="input-base cursor-pointer" required disabled={!form.wilaya}>
                  <option value="">{form.wilaya ? t("choisir_commune") : t("choisir_dabord_wilaya")}</option>
                  {communes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="btn-primary h-14 w-full text-[13px] cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                  </svg>
                  {t("chargement")}
                </span>
              ) : (
                lang === "fr" ? "Confirmer la commande →" : "تأكيد الطلبية وتثبيت الشراء ←"
              )}
            </button>

            <p className="text-center text-[11px] text-[#7a7368]">
              💰 {lang === "fr" ? "Aucun paiement en ligne — vous payez à la réception de votre commande." : "لا يوجد دفع إلكتروني — ستقومين بالدفع نقدًا عند استلام طلبيتكِ من عون التوصيل."}
            </p>
          </form>
        </section>

        {/* ── ORDER SUMMARY ── */}
        <aside className="animate-slide-right">
          <div className="sticky top-[100px] rounded-2xl bg-white p-6 shadow-sm border border-black/[0.03]">
            <h2 className="font-serif text-xl uppercase tracking-[0.1em]">{t("panier_titre")}</h2>
            <div className="mt-5 space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {articles.map((article, i) => (
                <div key={`${article.produitId}-${i}`} className="flex gap-4">
                  <img
                    src={article.imageUrl}
                    alt={article.nom}
                    className="h-20 w-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#080808] leading-snug">{article.nom}</p>
                      <p className="text-xs text-[#7a7368]">x{article.quantite} · {article.couleur}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#c9a84c]">{formatPrice(article.prix * article.quantite, lang)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-black/[0.05] pt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#7a7368]">{t("sous_total")}</span>
                <span>{formatPrice(total, lang)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a7368]">{t("livraison")}</span>
                <span className={livraisonOfferte ? "font-semibold text-[#c9a84c]" : "text-[#7a7368]"}>
                  {livraisonOfferte ? t("offert_shipping") : (lang === "fr" ? "À confirmer" : "يتم تحديده")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a7368]">{t("etape_paiement")}</span>
                <span className="font-semibold text-[#c9a84c]">{lang === "fr" ? "À la livraison 💰" : "عند الاستلام 💰"}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-black/[0.05] text-base font-bold">
                <span>{t("total")}</span>
                <span className="text-[#c9a84c]">{formatPrice(total, lang)}</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
