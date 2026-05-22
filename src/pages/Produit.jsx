import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CarteProduit from "../components/CarteProduit";
import Spinner from "../components/Spinner";
import { usePanier } from "../context/PanierContext";
import { db } from "../firebase";
import useProduits from "../hooks/useProduits";

function formatPrice(value) {
  return `${Number(value).toLocaleString("fr-FR")} DA`;
}

export default function Produit() {
  const { id } = useParams();
  const { ajouterAuPanier } = usePanier();
  const { produits } = useProduits();
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantite, setQuantite] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [openAccordion, setOpenAccordion] = useState("description");

  useEffect(() => {
    async function fetchProduit() {
      try {
        setLoading(true);
        setError("");
        const snapshot = await getDoc(doc(db, "produits", id));

        if (!snapshot.exists()) {
          setError("Produit introuvable.");
          return;
        }

        const data = { id: snapshot.id, ...snapshot.data() };
        setProduit(data);
        setSelectedSize(data.tailles?.[0] || "");
        
        const initialColor = data.couleurs?.[0]?.nom || data.couleurs?.[0] || "";
        setSelectedColor(initialColor);
        
        const initialImage = data.couleurs?.[0]?.images?.[0]?.imageUrl || data.couleurs?.[0]?.imageUrl || data.images?.[0] || data.imageUrl || "";
        setMainImage(initialImage);
      } catch (fetchError) {
        setError("Impossible de charger ce produit.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduit();
  }, [id]);

  const handleAddToCart = () => {
    if (!produit) {
      return;
    }

    ajouterAuPanier({
      produitId: produit.id,
      nom: produit.nom,
      prix: produit.prix,
      taille: selectedSize,
      couleur: selectedColor,
      quantite,
      imageUrl: mainImage || produit.imageUrl,
    });
  };

  if (loading) {
    return <Spinner label="Chargement du produit..." />;
  }

  if (error || !produit) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="mb-6 text-red-700">{error || "Produit indisponible."}</p>
        <Link to="/catalogue" className="btn-secondary">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const activeColorObj = produit.couleurs?.find(
    (c) => (typeof c === "object" ? c.nom : c) === selectedColor
  );

  const images = activeColorObj?.images?.length
    ? activeColorObj.images.map((img) => img.imageUrl)
    : activeColorObj?.imageUrl
    ? [activeColorObj.imageUrl]
    : produit.images?.length
    ? produit.images
    : [produit.imageUrl].filter(Boolean);

  const similaires = produits.filter((item) => item.id !== produit.id).slice(0, 4);

  return (
    <div className="bg-white px-5 py-16 lg:px-10 animate-page">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[55fr_45fr]">
        <section className="animate-slide-left">
          <div className="overflow-hidden bg-[#F5F5F3]">
            <img src={mainImage || produit.imageUrl} alt={produit.nom} className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="mt-4 flex gap-3 flex-wrap">
            {images.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setMainImage(image)}
                className={`h-[90px] w-[70px] border transition-all duration-300 ${mainImage === image ? "border-[#1A1A1A] opacity-100" : "border-[#E8E8E8] opacity-75 hover:opacity-100"}`}
              >
                <img src={image} alt={produit.nom} className="h-full w-full object-cover animate-fade-in" />
              </button>
            ))}
          </div>
        </section>

        <section className="lg:pl-[60px] animate-slide-right">
          <p className="text-[12px] text-[#6B6B6B]">Accueil &gt; Femme &gt; Sacs &gt; {produit.nom}</p>
          <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">
            {produit.collection || produit.categorie || "Collection"}
          </p>
          <h1 className="mt-4 font-serif text-[28px] font-normal uppercase tracking-[0.1em] text-[#1A1A1A]">
            {produit.nom}
          </h1>
          <p className="mt-4 text-xl text-[#1A1A1A]">{formatPrice(produit.prix)}</p>

          <div className="my-6 border-t border-[#E8E8E8]" />

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">Couleur</p>
            <div className="mt-4 flex gap-3">
              {produit.couleurs?.map((couleur) => {
                const name = typeof couleur === "string" ? couleur : couleur.nom;
                const hex = typeof couleur === "string" ? couleur : couleur.hex;
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => {
                      setSelectedColor(name);
                      const firstImg = couleur.images?.[0]?.imageUrl || couleur.imageUrl;
                      if (firstImg) {
                        setMainImage(firstImg);
                      }
                    }}
                    className={`h-7 w-7 rounded-full border-2 transition-all duration-300 ${selectedColor === name ? "border-[#1A1A1A] scale-110" : "border-[#E8E8E8] hover:scale-105"}`}
                    style={{ backgroundColor: hex || name }}
                  />
                );
              })}
            </div>
          </div>

          {produit.tailles?.length > 0 && (
            <div className="mt-8">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">Taille</p>
              <div className="mt-4 flex gap-3">
                {produit.tailles.map((taille) => (
                  <button
                    key={taille}
                    type="button"
                    onClick={() => setSelectedSize(taille)}
                    className={`grid h-11 w-11 place-items-center border text-sm ${
                      selectedSize === taille ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-[#E8E8E8] text-[#1A1A1A]"
                    }`}
                  >
                    {taille}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center border border-[#E8E8E8]">
            <button type="button" className="px-4 py-2" onClick={() => setQuantite((current) => Math.max(1, current - 1))}>
              -
            </button>
            <span className="min-w-10 text-center">{quantite}</span>
            <button type="button" className="px-4 py-2" onClick={() => setQuantite((current) => current + 1)}>
              +
            </button>
          </div>

          <button type="button" onClick={handleAddToCart} className="btn-primary mt-8 h-[54px] w-full">
            Ajouter au panier
          </button>
          <button type="button" className="btn-secondary mt-3 w-full">
            Ajouter aux favoris
          </button>

          <div className="mt-8">
            {[
              ["description", "Description", produit.description || "Un essentiel de maroquinerie aux finitions soignees."],
              ["matieres", "Matieres et entretien", "Nettoyer avec un chiffon doux. Eviter l'exposition prolongee a l'humidite."],
              ["livraison", "Livraison", "Livraison partout en Algérie. Paiement à la réception."],
            ].map(([key, title, content]) => (
              <div key={key} className="border-b border-[#E8E8E8] py-5">
                <button type="button" onClick={() => setOpenAccordion(openAccordion === key ? "" : key)} className="flex w-full items-center justify-between text-[13px] font-semibold uppercase tracking-[0.12em]">
                  {title}
                  <span>{openAccordion === key ? "-" : "+"}</span>
                </button>
                {openAccordion === key && <p className="mt-4 text-sm leading-7 text-[#6B6B6B]">{content}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {similaires.length > 0 && (
        <section className="mx-auto max-w-7xl py-20">
          <h2 className="section-title">Vous aimerez aussi</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {similaires.map((item) => (
              <CarteProduit key={item.id} produit={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
