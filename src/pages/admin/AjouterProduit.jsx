import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { uploadProductImage } from "../../cloudinary";
import { db } from "../../firebase";

const taillesDisponibles = ["S", "M", "L", "XL"];
const couleursDisponibles = ["rouge", "noir", "blanc", "beige", "bleu", "vert"];

const initialForm = {
  nom: "",
  description: "",
  prix: "",
  categorie: "robes",
  tailles: ["M"],
  couleurs: ["noir"],
  stock: "",
};

export default function AjouterProduit() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = useMemo(() => {
    return form.nom.trim() && form.description.trim() && form.prix && form.stock && imageFile;
  }, [form, imageFile]);

  const toggleChoice = (field, value) => {
    setForm((current) => {
      const exists = current[field].includes(value);
      const nextValues = exists
        ? current[field].filter((item) => item !== value)
        : [...current[field], value];

      return {
        ...current,
        [field]: nextValues.length ? nextValues : [value],
      };
    });
  };

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!imageFile) {
        setError("Veuillez choisir une image.");
        return;
      }

      const { imageUrl, imagePublicId } = await uploadProductImage(imageFile);

      await addDoc(collection(db, "produits"), {
        nom: form.nom.trim(),
        description: form.description.trim(),
        prix: Number(form.prix),
        categorie: form.categorie,
        tailles: form.tailles,
        couleurs: form.couleurs,
        imageUrl,
        imagePublicId,
        imageProvider: "cloudinary",
        stock: Number(form.stock),
        dateAjout: serverTimestamp(),
      });

      navigate("/admin/produits", { replace: true });
    } catch {
      setError("Impossible d'ajouter le produit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-or">Produits</p>
          <h1 className="mt-3 text-4xl font-bold">Ajouter un produit</h1>
        </div>
        <Link to="/admin/produits" className="btn-secondary">
          Retour
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_0.75fr]">
        <section className="card-surface rounded-[2rem] p-6 sm:p-8">
          <div className="grid gap-5">
            <label className="space-y-2">
              <span className="text-sm text-white/70">Nom</span>
              <input name="nom" value={form.nom} onChange={handleChange} className="input-base" required />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Description</span>
              <textarea name="description" value={form.description} onChange={handleChange} rows="5" className="input-base" required />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-white/70">Prix</span>
                <input name="prix" type="number" value={form.prix} onChange={handleChange} className="input-base" required />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-white/70">Stock</span>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} className="input-base" required />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Catégorie</span>
              <select name="categorie" value={form.categorie} onChange={handleChange} className="input-base">
                <option value="robes">robes</option>
                <option value="t-shirts">t-shirts</option>
                <option value="pantalons">pantalons</option>
                <option value="vestes">vestes</option>
              </select>
            </label>

            <div className="space-y-3">
              <span className="text-sm text-white/70">Tailles</span>
              <div className="flex flex-wrap gap-3">
                {taillesDisponibles.map((taille) => (
                  <button
                    key={taille}
                    type="button"
                    onClick={() => toggleChoice("tailles", taille)}
                    className={`rounded-full px-4 py-2 font-semibold ${
                      form.tailles.includes(taille) ? "bg-or text-black" : "border border-white/15 text-white/70"
                    }`}
                  >
                    {taille}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-sm text-white/70">Couleurs</span>
              <div className="flex flex-wrap gap-3">
                {couleursDisponibles.map((couleur) => (
                  <button
                    key={couleur}
                    type="button"
                    onClick={() => toggleChoice("couleurs", couleur)}
                    className={`rounded-full px-4 py-2 font-semibold ${
                      form.couleurs.includes(couleur) ? "bg-or text-black" : "border border-white/15 text-white/70"
                    }`}
                  >
                    {couleur}
                  </button>
                ))}
              </div>
            </div>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Image du produit</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="input-base file:mr-4 file:rounded-full file:border-0 file:bg-or file:px-4 file:py-2 file:font-semibold file:text-black" />
            </label>

            {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}

            <button type="submit" disabled={!isValid || loading} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Enregistrement..." : "Enregistrer le produit"}
            </button>
          </div>
        </section>

        <aside className="card-surface rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold">Aperçu image</h2>
          {preview ? (
            <img src={preview} alt="Aperçu" className="mt-6 h-[420px] w-full rounded-[1.75rem] object-cover" />
          ) : (
            <div className="mt-6 grid h-[420px] place-items-center rounded-[1.75rem] border border-dashed border-white/15 text-white/40">
              Choisissez une image
            </div>
          )}
        </aside>
      </form>
    </div>
  );
}
