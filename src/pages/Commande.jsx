import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { usePanier } from "../context/PanierContext";
import { db } from "../firebase";
import { wilayasCommunes, wilayas } from "../data/communesAlgerie";

function formatPrice(value) {
  return `${Number(value).toLocaleString("fr-FR")} DA`;
}

const initialForm = {
  prenom: "",
  nom: "",
  telephone: "",
  email: "",
  adresse: "",
  wilaya: "",
  commune: "",
};

export default function Commande() {
  const navigate = useNavigate();
  const { articles, total, viderPanier } = usePanier();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const communes = form.wilaya ? (wilayasCommunes[form.wilaya] || []) : [];

  const canSubmit = useMemo(
    () =>
      form.prenom.trim() &&
      form.nom.trim() &&
      form.telephone.trim() &&
      form.email.trim() &&
      form.adresse.trim() &&
      form.wilaya.trim() &&
      form.commune.trim(),
    [form],
  );

  if (articles.length === 0) {
    return <Navigate to="/panier" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      // Reset commune when wilaya changes
      ...(name === "wilaya" ? { commune: "" } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const numero = `CMD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
      const docRef = await addDoc(collection(db, "commandes"), {
        numero,
        client: {
          prenom: form.prenom.trim(),
          nom: form.nom.trim(),
          telephone: form.telephone.trim(),
          email: form.email.trim(),
          adresse: form.adresse.trim(),
          wilaya: form.wilaya,
          commune: form.commune,
        },
        articles,
        sousTotal: total,
        fraisLivraison: 0,
        total,
        statut: "en attente",
        date: serverTimestamp(),
      });
      sessionStorage.setItem("magsin-last-order-id", numero || docRef.id);
      viderPanier();
      navigate("/confirmation", { replace: true, state: { orderId: numero || docRef.id } });
    } catch (submitError) {
      setError("Impossible d'enregistrer la commande. Reessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10 animate-page">
      <div className="mb-10 flex items-center justify-center gap-4 text-[12px] uppercase tracking-[0.16em] text-[#6B6B6B]">
        <span>Panier</span>
        <span>→</span>
        <span className="text-[#1A1A1A]">Informations</span>
        <span>→</span>
        <span>Confirmation</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-[60fr_40fr]">
        <section className="animate-slide-left">
          <h1 className="font-serif text-3xl font-normal uppercase tracking-[0.1em]">Informations</h1>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">Prenom</span>
                <input name="prenom" value={form.prenom} onChange={handleChange} className="input-base" required />
              </label>
              <label>
                <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">Nom</span>
                <input name="nom" value={form.nom} onChange={handleChange} className="input-base" required />
              </label>
            </div>

            <label>
              <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">Telephone</span>
              <input name="telephone" value={form.telephone} onChange={handleChange} className="input-base" required />
            </label>

            <label>
              <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">Email</span>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="input-base" required />
            </label>

            <label>
              <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">Adresse</span>
              <textarea name="adresse" value={form.adresse} onChange={handleChange} rows="3" className="input-base" required />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">Wilaya</span>
                <select name="wilaya" value={form.wilaya} onChange={handleChange} className="input-base" required>
                  <option value="">Choisir une wilaya</option>
                  {wilayas.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">Commune</span>
                <select name="commune" value={form.commune} onChange={handleChange} className="input-base" required disabled={!form.wilaya}>
                  <option value="">{form.wilaya ? "Choisir une commune" : "Choisir d'abord une wilaya"}</option>
                  {communes.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>

            {error && <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

            <button type="submit" disabled={!canSubmit || loading} className="btn-primary h-[54px] w-full">
              {loading ? "Envoi en cours..." : "Confirmer la commande"}
            </button>
          </form>
        </section>

        <aside className="h-fit bg-[#F5F5F3] p-6 animate-slide-right">
          <h2 className="font-serif text-2xl font-normal uppercase tracking-[0.1em]">Recapitulatif</h2>
          <div className="mt-6 space-y-5">
            {articles.map((article, index) => (
              <div key={`${article.produitId}-${index}`} className="grid grid-cols-[64px_1fr_auto] gap-4 border-b border-[#E8E8E8] pb-5">
                <img src={article.imageUrl} alt={article.nom} className="h-20 w-16 object-cover" />
                <div>
                  <p className="text-sm text-[#1A1A1A]">{article.nom}</p>
                  <p className="mt-1 text-sm text-[#6B6B6B]">
                    x{article.quantite} / {article.couleur}
                  </p>
                </div>
                <p className="text-sm">{formatPrice(article.prix * article.quantite)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
