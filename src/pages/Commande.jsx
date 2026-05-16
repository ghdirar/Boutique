import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { usePanier } from "../context/PanierContext";
import { db } from "../firebase";

const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Bejaia", "Biskra", "Bechar", "Blida", "Bouira",
  "Tamanrasset", "Tebessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Setif", "Saida",
  "Skikda", "Sidi Bel Abbes", "Annaba", "Guelma", "Constantine", "Medea", "Mostaganem", "M'Sila", "Mascara",
  "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdes", "El Tarf", "Tindouf", "Tissemsilt",
  "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Ain Defla", "Naama", "Ain Temouchent", "Ghardaia",
  "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Beni Abbes", "In Salah", "In Guezzam",
  "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
];

function formatPrice(value) {
  return `${Number(value).toLocaleString("fr-FR")} DA`;
}

const initialForm = {
  nom: "",
  telephone: "",
  email: "",
  adresse: "",
  wilaya: "",
};

export default function Commande() {
  const navigate = useNavigate();
  const { articles, total, viderPanier } = usePanier();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () =>
      form.nom.trim() &&
      form.telephone.trim() &&
      form.email.trim() &&
      form.adresse.trim() &&
      form.wilaya.trim(),
    [form],
  );

  if (articles.length === 0) {
    return <Navigate to="/panier" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const docRef = await addDoc(collection(db, "commandes"), {
        client: {
          nom: form.nom.trim(),
          telephone: form.telephone.trim(),
          email: form.email.trim(),
          adresse: form.adresse.trim(),
          wilaya: form.wilaya,
        },
        articles,
        total,
        statut: "en attente",
        date: serverTimestamp(),
      });

      sessionStorage.setItem("magsin-last-order-id", docRef.id);
      viderPanier();
      navigate("/confirmation", { replace: true, state: { orderId: docRef.id } });
    } catch (submitError) {
      setError("Impossible d'enregistrer la commande. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="card-surface rounded-[2rem] p-6 sm:p-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-or">Commande</p>
          <h1 className="section-title">Finaliser votre commande</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <label className="space-y-2">
            <span className="text-sm text-white/70">Nom complet</span>
            <input name="nom" value={form.nom} onChange={handleChange} className="input-base" required />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-white/70">Téléphone</span>
            <input name="telephone" value={form.telephone} onChange={handleChange} className="input-base" required />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-white/70">Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="input-base" required />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-white/70">Adresse</span>
            <textarea name="adresse" value={form.adresse} onChange={handleChange} rows="4" className="input-base" required />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-white/70">Wilaya</span>
            <select name="wilaya" value={form.wilaya} onChange={handleChange} className="input-base" required>
              <option value="">Choisir une wilaya</option>
              {wilayas.map((wilaya) => (
                <option key={wilaya} value={wilaya} className="bg-black">
                  {wilaya}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}

          <button type="submit" disabled={!canSubmit || loading} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Envoi en cours..." : "Confirmer la commande"}
          </button>
        </form>
      </section>

      <aside className="card-surface h-fit rounded-[2rem] p-6">
        <h2 className="text-2xl font-semibold">Récapitulatif</h2>
        <div className="mt-6 space-y-4">
          {articles.map((article, index) => (
            <div key={`${article.produitId}-${index}`} className="flex items-center gap-4 border-b border-white/10 pb-4">
              <img src={article.imageUrl} alt={article.nom} className="h-20 w-20 rounded-2xl object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{article.nom}</p>
                <p className="text-sm text-white/60">
                  {article.taille} • {article.couleur} • x{article.quantite}
                </p>
              </div>
              <span className="font-semibold text-or">{formatPrice(article.prix * article.quantite)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-lg font-bold">
          <span>Total</span>
          <span className="text-or">{formatPrice(total)}</span>
        </div>
      </aside>
    </div>
  );
}
