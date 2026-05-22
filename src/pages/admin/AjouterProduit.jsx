import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const initialForm = {
  nom: "",
  description: "",
  prix: "",
  categorie: "sacs-main",
  stock: "",
};

const initialCouleurs = [{ nom: "noir", hex: "#1A1A1A", images: [], newFiles: [] }];

export default function AjouterProduit() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [couleurs, setCouleurs] = useState(initialCouleurs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = useMemo(() => {
    return (
      form.nom.trim() &&
      form.description.trim() &&
      form.prix &&
      form.stock &&
      couleurs.every((couleur) => 
        couleur.nom.trim() && 
        couleur.hex.trim() && 
        ((couleur.images && couleur.images.length > 0) || (couleur.newFiles && couleur.newFiles.length > 0))
      )
    );
  }, [form, couleurs]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const updateCouleur = (index, field, value) => {
    setCouleurs((current) =>
      current.map((couleur, itemIndex) =>
        itemIndex === index ? { ...couleur, [field]: value } : couleur
      )
    );
  };

  const handleAddImages = (index, files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setCouleurs((current) =>
      current.map((couleur, itemIndex) =>
        itemIndex === index
          ? {
              ...couleur,
              newFiles: [...(couleur.newFiles || []), ...fileArray],
            }
          : couleur
      )
    );
  };

  const removeExistingImage = (colorIndex, imgIndex) => {
    setCouleurs((current) =>
      current.map((couleur, itemIndex) =>
        itemIndex === colorIndex
          ? {
              ...couleur,
              images: (couleur.images || []).filter((_, idx) => idx !== imgIndex),
            }
          : couleur
      )
    );
  };

  const removeNewFile = (colorIndex, fileId) => {
    setCouleurs((current) =>
      current.map((couleur, itemIndex) => {
        if (itemIndex === colorIndex) {
          const fileToRemove = (couleur.newFiles || []).find((f) => f.id === fileId);
          if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.preview);
          }
          return {
            ...couleur,
            newFiles: (couleur.newFiles || []).filter((f) => f.id !== fileId),
          };
        }
        return couleur;
      })
    );
  };

  const addCouleur = () => {
    setCouleurs((current) => [
      ...current,
      { nom: "", hex: "#C9A84C", images: [], newFiles: [] },
    ]);
  };

  const removeCouleur = (index) => {
    setCouleurs((current) => (current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index)));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const uploadedCouleurs = await Promise.all(
        couleurs.map(async (couleur) => {
          // Upload new files to Cloudinary in parallel
          const uploadedImages = await Promise.all(
            (couleur.newFiles || []).map(async (item) => {
              const uploadedImage = await uploadProductImage(item.file);
              return {
                imageUrl: uploadedImage.imageUrl,
                imagePublicId: uploadedImage.imagePublicId,
              };
            })
          );

          const allColorImages = [...(couleur.images || []), ...uploadedImages];

          return {
            nom: couleur.nom.trim(),
            hex: couleur.hex,
            images: allColorImages,
            // Fallbacks for backwards compatibility
            imageUrl: allColorImages[0]?.imageUrl || "",
            imagePublicId: allColorImages[0]?.imagePublicId || "",
          };
        }),
      );

      const allProductImages = uploadedCouleurs.flatMap((c) => c.images.map((img) => img.imageUrl));

      await addDoc(collection(db, "produits"), {
        nom: form.nom.trim(),
        description: form.description.trim(),
        prix: Number(form.prix),
        categorie: form.categorie,
        genre: "femme",
        tailles: [],
        couleurs: uploadedCouleurs,
        images: allProductImages,
        imageUrl: allProductImages[0] || "",
        imageProvider: "cloudinary",
        stock: Number(form.stock),
        badges: ["Nouveaute"],
        actif: true,
        dateAjout: serverTimestamp(),
      });

      navigate("/admin/produits", { replace: true });
    } catch (submitError) {
      console.error("Erreur ajout produit:", submitError);
      setError("Impossible d'ajouter le produit. Verifiez les images Cloudinary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-page">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-black/[0.05] pb-8 animate-fade-up">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">
            Administration
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium uppercase tracking-[0.05em] text-[#080808] sm:text-4xl">
            Ajouter un Produit
          </h1>
          <p className="mt-1 text-xs text-[#7a7368]">
            Créez une nouvelle fiche produit et associez ses photos par déclinaison couleur.
          </p>
        </div>
        <Link
          to="/admin/produits"
          className="btn-secondary h-11 rounded-full text-xs font-bold uppercase tracking-[0.15em] flex items-center self-start lg:self-auto"
        >
          ← Retour
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_0.75fr]">
        <section className="rounded-[28px] bg-white border border-black/[0.04] p-8 shadow-sm space-y-6">
          <div className="grid gap-6">
            <label className="block">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a7368] mb-2">Nom *</span>
              <input name="nom" value={form.nom} onChange={handleChange} className="input-base h-12" placeholder="Nom du sac..." required />
            </label>

            <label className="block">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a7368] mb-2">Description *</span>
              <textarea name="description" value={form.description} onChange={handleChange} rows="5" className="input-base py-3 h-auto resize-none" placeholder="Description de l'article..." required />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a7368] mb-2">Prix (DA) *</span>
                <input name="prix" type="number" value={form.prix} onChange={handleChange} className="input-base h-12" placeholder="Ex: 4800" required />
              </label>

              <label className="block">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a7368] mb-2">Stock disponible *</span>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} className="input-base h-12" placeholder="Ex: 10" required />
              </label>
            </div>

            <label className="block">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a7368] mb-2">Catégorie *</span>
              <select name="categorie" value={form.categorie} onChange={handleChange} className="input-base h-12">
                {categories.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <section className="space-y-4 pt-4 border-t border-black/[0.04]">
              <div className="flex items-center justify-between">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a7368]">Déclinaisons Couleurs</span>
                <button
                  type="button"
                  onClick={addCouleur}
                  className="btn-secondary !px-4 h-9 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] flex items-center"
                >
                  + Ajouter couleur
                </button>
              </div>

              {couleurs.map((couleur, index) => (
                <div key={index} className="grid gap-5 rounded-2xl border border-black/[0.04] bg-[#f7f4ef]/30 p-6 grid-cols-1 md:grid-cols-[1fr_150px_auto] items-start animate-fade-in relative">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#7a7368] block mb-2">Nom couleur</span>
                      <input 
                        value={couleur.nom} 
                        onChange={(event) => updateCouleur(index, "nom", event.target.value)} 
                        className="input-base h-11 text-xs" 
                        placeholder="Ex: Noir Intense" 
                      />
                    </label>
                  </div>
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#7a7368] block mb-2">Code couleur</span>
                      <input 
                        type="color" 
                        value={couleur.hex} 
                        onChange={(event) => updateCouleur(index, "hex", event.target.value)} 
                        className="h-11 w-full border border-[#E8E8E8] bg-white cursor-pointer p-1 rounded-full" 
                      />
                    </label>
                  </div>
                  <div className="flex items-center justify-end md:h-[70px] pt-4 md:pt-0">
                    <button 
                      type="button" 
                      onClick={() => removeCouleur(index)} 
                      className="text-[10px] font-bold uppercase tracking-[0.1em] text-red-600 hover:text-red-800 transition-colors"
                      disabled={couleurs.length === 1}
                    >
                      Retirer
                    </button>
                  </div>

                  <div className="col-span-full space-y-2 mt-2">
                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#7a7368] block mb-2">Photos (Plusieurs images acceptées)</span>
                    <div className="flex flex-wrap gap-3 items-center">
                      {/* Existing images */}
                      {(couleur.images || []).map((img, imgIdx) => (
                        <div key={`existing-${imgIdx}`} className="relative group h-24 w-20 rounded-xl border border-black/[0.05] overflow-hidden bg-[#f7f4ef] animate-scale-in">
                          <img src={img.imageUrl} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index, imgIdx)}
                            className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 text-white text-[9px] font-bold uppercase tracking-wider"
                          >
                            Supprimer
                          </button>
                        </div>
                      ))}

                      {/* New files */}
                      {(couleur.newFiles || []).map((fileObj) => (
                        <div key={fileObj.id} className="relative group h-24 w-20 rounded-xl border border-black/[0.05] overflow-hidden bg-[#f7f4ef] animate-scale-in">
                          <img src={fileObj.preview} alt="" className="h-full w-full object-cover" />
                          <span className="absolute top-1 left-1 bg-[#c9a84c] text-[7px] text-[#080808] px-1 py-0.5 rounded uppercase tracking-widest font-bold animate-fade-in">New</span>
                          <button
                            type="button"
                            onClick={() => removeNewFile(index, fileObj.id)}
                            className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 text-white text-[9px] font-bold uppercase tracking-wider"
                          >
                            Supprimer
                          </button>
                        </div>
                      ))}

                      {/* Add Image Button */}
                      <label className="h-24 w-20 rounded-xl border border-dashed border-[#c9a84c]/50 flex flex-col items-center justify-center cursor-pointer hover:bg-[#f7f4ef]/60 transition-all duration-300 text-[#c9a84c] group">
                        <span className="text-xl font-light group-hover:scale-110 transition-transform">+</span>
                        <span className="text-[8px] uppercase tracking-[0.12em] font-bold mt-1">Photos</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(event) => handleAddImages(index, event.target.files)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {error && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!isValid || loading}
              className="btn-primary h-14 w-full text-[13px] bg-[#080808] hover:bg-[#c9a84c] text-white hover:text-white"
            >
              {loading ? "Enregistrement..." : "Enregistrer le produit →"}
            </button>
          </div>
        </section>

        <aside className="rounded-[28px] bg-white border border-black/[0.04] p-8 shadow-sm h-fit sticky top-[100px] space-y-6">
          <h2 className="font-serif text-xl font-medium uppercase tracking-[0.05em] text-[#080808] border-b border-black/[0.04] pb-4">
            Aperçu Couleurs
          </h2>
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-1">
            {couleurs.map((couleur, index) => {
              const allPreviews = [
                ...(couleur.images || []).map((img) => img.imageUrl),
                ...(couleur.newFiles || []).map((f) => f.preview)
              ];

              return (
                <div key={index} className="rounded-2xl border border-black/[0.04] p-4 space-y-4 bg-white shadow-sm">
                  {allPreviews.length > 0 ? (
                    <div className="space-y-2">
                      <img 
                        src={allPreviews[0]} 
                        alt={couleur.nom} 
                        className="h-56 w-full object-cover rounded-xl shadow-inner border border-black/[0.03]" 
                      />
                      {allPreviews.length > 1 && (
                        <div className="grid grid-cols-4 gap-1.5 animate-fade-in">
                          {allPreviews.slice(1).map((preview, pIdx) => (
                            <img 
                              key={pIdx} 
                              src={preview} 
                              alt="" 
                              className="aspect-[4/5] w-full object-cover rounded-md border border-black/[0.03]" 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid h-40 place-items-center border border-dashed border-black/[0.06] rounded-xl text-xs text-[#7a7368] bg-[#f7f4ef]/30">
                      Aucune photo ajoutée
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 pt-2 border-t border-black/[0.03]">
                    <span 
                      className="h-5 w-5 rounded-full border border-black/[0.1] shadow-inner" 
                      style={{ backgroundColor: couleur.hex }} 
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#080808]">
                      {couleur.nom || "Couleur sans nom"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </form>
    </div>
  );
}
