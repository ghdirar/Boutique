import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CarteProduit from "../components/CarteProduit";
import Spinner from "../components/Spinner";
import { usePanier } from "../context/PanierContext";
import { useFavoris } from "../context/FavorisContext";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";
import { db } from "../firebase";
import useProduits from "../hooks/useProduits";

function formatPrice(value, lang) {
  return `${Number(value).toLocaleString("fr-FR")} ${lang === "ar" ? "د.ج" : "DA"}`;
}

export default function Produit() {
  const { id } = useParams();
  const { ajouterAuPanier } = usePanier();
  const { isFavori, toggleFavori } = useFavoris();
  const { addToast } = useToast();
  const { t, lang } = useLanguage();
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
          setError(lang === "fr" ? "Produit introuvable." : "المنتج غير موجود.");
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
        setError(lang === "fr" ? "Impossible de charger ce produit." : "فشل تحميل تفاصيل هذا المنتج.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduit();
  }, [id, lang]);

  const handleAddToCart = () => {
    if (!produit) return;

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

  const isProdFavori = produit ? isFavori(produit.id) : false;

  const handleToggleFavori = () => {
    if (!produit) return;
    toggleFavori(produit.id);
    const msg = isProdFavori 
      ? (lang === "fr" ? `${produit.nom} retiré des favoris` : `تم حذف ${produit.nom} من المفضلة`)
      : (lang === "fr" ? `${produit.nom} ajouté aux favoris` : `تم إضافة ${produit.nom} للمفضلة`);
    addToast(msg, "💛");
  };

  if (loading) {
    return <Spinner label={t("chargement")} />;
  }

  if (error || !produit) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="mb-6 text-red-700">{error || "Produit indisponible."}</p>
        <Link to="/catalogue" className="btn-secondary">
          {t("voir_catalogue")}
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
        <section className="animate-slide-left group">
          {/* Main Animated Image Viewport */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F5F3] rounded-3xl shadow-[0_4px_30px_rgba(8,8,8,0.02)]">
            {images.map((imgUrl, idx) => (
              <img
                key={imgUrl}
                src={imgUrl}
                alt={`${produit.nom} view ${idx + 1}`}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out ${
                  mainImage === imgUrl ? "opacity-100 scale-100 z-10" : "opacity-0 scale-[1.03] z-0 pointer-events-none"
                }`}
              />
            ))}
            
            {/* Elegant Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    const currentIdx = images.indexOf(mainImage);
                    const prevIdx = (currentIdx - 1 + images.length) % images.length;
                    setMainImage(images[prevIdx]);
                  }}
                  className="absolute left-5 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(8,8,8,0.08)] text-[#080808] border border-black/[0.03] opacity-0 hover:bg-white hover:scale-105 transition-all duration-300 group-hover:opacity-100 cursor-pointer active:scale-95"
                  aria-label="Image précédente"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currentIdx = images.indexOf(mainImage);
                    const nextIdx = (currentIdx + 1) % images.length;
                    setMainImage(images[nextIdx]);
                  }}
                  className="absolute right-5 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(8,8,8,0.08)] text-[#080808] border border-black/[0.03] opacity-0 hover:bg-white hover:scale-105 transition-all duration-300 group-hover:opacity-100 cursor-pointer active:scale-95"
                  aria-label="Image suivante"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnails Gallery */}
          <div className="mt-5 flex gap-3.5 flex-wrap">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setMainImage(image)}
                className={`h-[90px] w-[72px] rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                  mainImage === image 
                    ? "border-[#c9a84c] opacity-100 scale-102 shadow-[0_4px_12px_rgba(201,168,76,0.15)]" 
                    : "border-black/[0.04] opacity-60 hover:opacity-100"
                }`}
              >
                <img src={image} alt={`${produit.nom} thumbnail ${index + 1}`} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </button>
            ))}
          </div>
        </section>

        <section className={`animate-slide-right ${lang === "fr" ? "lg:pl-[60px]" : "lg:pr-[60px]"}`}>
          <p className="text-[12px] text-[#6B6B6B]">
            {lang === "fr" 
              ? <>Accueil &gt; Femme &gt; Sacs &gt; {produit.nom}</> 
              : <>الرئيسية &gt; نساء &gt; حقائب &gt; {produit.nom}</>}
          </p>
          <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">
            {produit.collection || produit.categorie || "Collection"}
          </p>
          <h1 className="mt-4 font-serif text-[28px] font-normal uppercase tracking-[0.1em] text-[#1A1A1A]">
            {produit.nom}
          </h1>
          <p className="mt-4 text-xl text-[#1A1A1A]">{formatPrice(produit.prix, lang)}</p>

          <div className="my-6 border-t border-[#E8E8E8]" />

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">{t("couleur")}</p>
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
                    className={`h-7 w-7 rounded-full border-2 transition-all duration-300 cursor-pointer ${selectedColor === name ? "border-[#1A1A1A] scale-110 shadow-sm" : "border-[#E8E8E8] hover:scale-105"}`}
                    style={{ backgroundColor: hex || name }}
                  />
                );
              })}
            </div>
          </div>

          {produit.tailles?.length > 0 && (
            <div className="mt-8">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">{t("taille")}</p>
              <div className="mt-4 flex gap-3">
                {produit.tailles.map((taille) => (
                  <button
                    key={taille}
                    type="button"
                    onClick={() => setSelectedSize(taille)}
                    className={`grid h-11 w-11 place-items-center border text-sm transition-all cursor-pointer ${
                      selectedSize === taille ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-[#E8E8E8] text-[#1A1A1A] hover:border-black"
                    }`}
                  >
                    {taille}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6B6B6B]">{t("quantite")}</p>
            <div className="mt-4 flex items-center border border-[#E8E8E8] max-w-[120px] rounded-full overflow-hidden bg-[#f7f4ef]/50">
              <button type="button" className="px-4 py-2 hover:bg-black/[0.03] transition font-bold cursor-pointer" onClick={() => setQuantite((current) => Math.max(1, current - 1))}>
                -
              </button>
              <span className="min-w-10 text-center font-semibold text-sm">{quantite}</span>
              <button type="button" className="px-4 py-2 hover:bg-black/[0.03] transition font-bold cursor-pointer" onClick={() => setQuantite((current) => current + 1)}>
                +
              </button>
            </div>
          </div>

          <button type="button" onClick={handleAddToCart} className="btn-primary mt-8 h-[54px] w-full cursor-pointer">
            {t("ajouter_panier")}
          </button>
          
          <button type="button" onClick={handleToggleFavori} className="btn-secondary mt-3 w-full cursor-pointer">
            {isProdFavori ? (lang === "fr" ? "Retirer des favoris" : "حذف من المفضلة") : (lang === "fr" ? "Ajouter aux favoris" : "إضافة للمفضلة")}
          </button>

          <div className="mt-8">
            {[
              ["description", lang === "fr" ? "Description" : "الوصف", produit.description || (lang === "fr" ? "Un essentiel de maroquinerie aux finitions soignées." : "قطعة جلدية فاخرة وأساسية بتشطيبات يدوية متقنة.")],
              ["matieres", lang === "fr" ? "Matières et entretien" : "الخامة والعناية", lang === "fr" ? "Nettoyer avec un chiffon doux. Éviter l'exposition prolongée à l'humidité." : "تُنظف بقطعة قماش ناعمة. يُرجى تجنب تعريضها للرطوبة لفترات طويلة."],
              ["livraison", lang === "fr" ? "Livraison" : "الشحن والتوصيل", lang === "fr" ? "Livraison partout en Algérie. Paiement cash à la réception." : "التوصيل متوفر لكافة الولايات الجزائرية. الدفع نقدًا عند الاستلام."],
            ].map(([key, title, content]) => (
              <div key={key} className="border-b border-[#E8E8E8] py-5">
                <button type="button" onClick={() => setOpenAccordion(openAccordion === key ? "" : key)} className="flex w-full items-center justify-between text-[13px] font-semibold uppercase tracking-[0.12em] cursor-pointer">
                  <span>{title}</span>
                  <span className="font-mono text-base">{openAccordion === key ? "−" : "+"}</span>
                </button>
                {openAccordion === key && <p className="mt-4 text-sm leading-7 text-[#6B6B6B] animate-fade-in">{content}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {similaires.length > 0 && (
        <section className="mx-auto max-w-7xl py-20">
          <h2 className="section-title text-center lg:text-left">{t("vous_aimerez_aussi")}</h2>
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
