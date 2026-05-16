import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { uploadProductImage } from "../../cloudinary";
import { db } from "../../firebase";


const categories = [
  ["sacs-iconiques", "sacs iconiques"],
  ["sacs-baguette", "sacs forme baguette"],
  ["sacs-main", "sacs a main"],
  ["sacs-epaule", "sacs porte epaule"],
  ["sacs-cabas", "sacs cabas"],
  ["sacs-voyage", "sacs de voyage"],
  ["petite-maroquinerie", "petite maroquinerie"],
];

function normalizeCouleurs(data) {
  if (Array.isArray(data.couleurs) && data.couleurs.length) {
    return data.couleurs.map((couleur, index) => {
      if (typeof couleur === "string") {
        const imageUrl = index === 0 ? data.imageUrl : "";
        return { nom: couleur, hex: "#1A1A1A", imageUrl, imagePublicId: "", file: null, preview: imageUrl };
      }
      return {
        nom: couleur.nom || "",
        hex: couleur.hex || "#1A1A1A",
        imageUrl: couleur.imageUrl || "",
        imagePublicId: couleur.imagePublicId || "",
        file: null,
        preview: couleur.imageUrl || "",
      };
    });
  }

  return [{ nom: "noir", hex: "#1A1A1A", imageUrl: data.imageUrl || "", imagePublicId: data.imagePublicId || "", file: null, preview: data.imageUrl || "" }];
}

export default function ModifierProduit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [couleurs, setCouleurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduit() {
      try {
        setLoading(true);
        const snapshot = await getDoc(doc(db, "produits", id));

        if (!snapshot.exists()) {
          setError("Produit introuvable.");
          return;
        }

        const data = snapshot.data();
        setForm({
          nom: data.nom || "",
          description: data.description || "",
          prix: data.prix || "",
          categorie: data.categorie || "sacs-main",
          stock: data.stock || "",
          imageProvider: data.imageProvider || "cloudinary",
        });
        setCouleurs(normalizeCouleurs(data));
      } catch {
        setError("Impossible de charger le produit.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduit();
  }, [id]);

  const isValid = useMemo(() => {
    return (
      form?.nom?.trim() &&
      form?.description?.trim() &&
      form?.prix !== "" &&
      form?.stock !== "" &&
      couleurs.every((couleur) => couleur.nom.trim() && couleur.hex.trim() && (couleur.file || couleur.imageUrl))
    );
  }, [form, couleurs]);




  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const updateCouleur = (index, field, value) => {
    setCouleurs((current) => current.map((couleur, itemIndex) => (itemIndex === index ? { ...couleur, [field]: value } : couleur)));
  };

  const updateCouleurFile = (index, file) => {
    if (!file) return;
    setCouleurs((current) =>
      current.map((couleur, itemIndex) =>
        itemIndex === index ? { ...couleur, file, preview: URL.createObjectURL(file) } : couleur,
      ),
    );
  };

  const addCouleur = () => {
    setCouleurs((current) => [...current, { nom: "", hex: "#C9A84C", imageUrl: "", imagePublicId: "", file: null, preview: "" }]);
  };

  const removeCouleur = (index) => {
    setCouleurs((current) => (current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index)));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form) return;

    try {
      setSaving(true);
      setError("");

      const uploadedCouleurs = await Promise.all(
        couleurs.map(async (couleur) => {
          if (couleur.file) {
            const uploadedImage = await uploadProductImage(couleur.file);
            return {
              nom: couleur.nom.trim(),
              hex: couleur.hex,
              imageUrl: uploadedImage.imageUrl,
              imagePublicId: uploadedImage.imagePublicId,
            };
          }

          return {
            nom: couleur.nom.trim(),
            hex: couleur.hex,
            imageUrl: couleur.imageUrl,
            imagePublicId: couleur.imagePublicId || "",
          };
        }),
      );

      const images = uploadedCouleurs.map((couleur) => couleur.imageUrl).filter(Boolean);

      await updateDoc(doc(db, "produits", id), {
        nom: form.nom.trim(),
        description: form.description.trim(),
        prix: Number(form.prix),
        categorie: form.categorie,
        genre: "femme",
        tailles: [],
        couleurs: uploadedCouleurs,
        images,
        stock: Number(form.stock),
        imageUrl: images[0] || "",
        imageProvider: "cloudinary",
      });

      navigate("/admin/produits", { replace: true });
    } catch (submitError) {
      console.error("Erreur modification produit:", submitError);
      setError("Impossible de mettre a jour le produit.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner label="Chargement du produit..." />;
  }

  if (error && !form) {
    return <p className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-8 animate-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-or">Produits</p>
          <h1 className="mt-3 text-4xl font-bold">Modifier le produit</h1>
        </div>
        <Link to="/admin/produits" className="btn-secondary">
          Retour
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_0.75fr]">
        <section className="card-surface p-6 sm:p-8">
          <div className="grid gap-5">
            <label className="space-y-2">
              <span className="text-sm text-[#6B6B6B]">Nom</span>
              <input name="nom" value={form.nom} onChange={handleChange} className="input-base" required />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-[#6B6B6B]">Description</span>
              <textarea name="description" value={form.description} onChange={handleChange} rows="5" className="input-base" required />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-[#6B6B6B]">Prix</span>
                <input name="prix" type="number" value={form.prix} onChange={handleChange} className="input-base" required />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-[#6B6B6B]">Stock</span>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} className="input-base" required />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm text-[#6B6B6B]">Categorie</span>
              <select name="categorie" value={form.categorie} onChange={handleChange} className="input-base">
                {categories.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>



            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B6B6B]">Images par couleur</span>
                <button type="button" onClick={addCouleur} className="btn-secondary !px-4 !py-2">
                  Ajouter couleur
                </button>
              </div>

              {couleurs.map((couleur, index) => (
                <div key={index} className="grid gap-4 border border-[#E8E8E8] p-4 md:grid-cols-[1fr_120px_1.3fr_auto] md:items-end">
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.18em] text-[#6B6B6B]">Nom couleur</span>
                    <input value={couleur.nom} onChange={(event) => updateCouleur(index, "nom", event.target.value)} className="input-base" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.18em] text-[#6B6B6B]">Hex</span>
                    <input type="color" value={couleur.hex} onChange={(event) => updateCouleur(index, "hex", event.target.value)} className="h-12 w-full border border-[#E8E8E8] bg-white" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.18em] text-[#6B6B6B]">Remplacer l'image</span>
                    <input type="file" accept="image/*" onChange={(event) => updateCouleurFile(index, event.target.files?.[0])} className="input-base" />
                  </label>
                  <button type="button" onClick={() => removeCouleur(index)} className="text-sm font-semibold text-red-600">
                    Supprimer
                  </button>
                </div>
              ))}
            </section>

            {error && <p className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={!isValid || saving} className="btn-primary w-full">
              {saving ? "Mise a jour..." : "Mettre a jour le produit"}
            </button>
          </div>
        </section>

        <aside className="card-surface p-6">
          <h2 className="text-2xl font-semibold">Apercu couleurs</h2>
          <div className="mt-6 space-y-4">
            {couleurs.map((couleur, index) => (
              <div key={index} className="border border-[#E8E8E8] p-3">
                {couleur.preview ? (
                  <img src={couleur.preview} alt={couleur.nom || "Couleur"} className="h-48 w-full object-cover" />
                ) : (
                  <div className="grid h-48 place-items-center border border-dashed border-[#E8E8E8] text-[#6B6B6B]">Image couleur</div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: couleur.hex }} />
                  <span className="text-sm text-[#6B6B6B]">{couleur.nom || "Sans nom"}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </form>
    </div>
  );
}
