import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFavoris } from "../context/FavorisContext";
import { useToast } from "../context/ToastContext";
import { usePanier } from "../context/PanierContext";

function formatPrice(value) {
  return `${Number(value).toLocaleString("fr-FR")} DA`;
}

const fallbackSwatches = ["#efe3d2", "#1a1a1a", "#b58d73", "#6f765e"];

export default function CarteProduit({ produit }) {
  const couleurs = Array.isArray(produit.couleurs) && produit.couleurs.length ? produit.couleurs : fallbackSwatches;
  const badge = produit.badges?.[0] || "Nouveauté";

  const firstColorImage = couleurs.find((c) => typeof c === "object" && c.imageUrl)?.imageUrl;
  const defaultImage = firstColorImage || (Array.isArray(produit.images) ? produit.images[0] : null) || produit.imageUrl;

  const [activeColor, setActiveColor] = useState(() => {
    const first = couleurs[0];
    return typeof first === "object" ? first.nom : first;
  });

  const { isFavori, toggleFavori } = useFavoris();
  const { ajouterAuPanier } = usePanier();
  const { addToast } = useToast();
  const favoriActive = isFavori(produit.id);

  // Get all unique images for this product, strictly prioritizing the selected color
  const finalImages = React.useMemo(() => {
    if (activeColor) {
      const activeColObj = (Array.isArray(produit.couleurs) ? produit.couleurs : []).find(
        (c) => typeof c === "object" && c.nom === activeColor
      );
      if (activeColObj) {
        const imgs = [];
        if (Array.isArray(activeColObj.images) && activeColObj.images.length > 0) {
          activeColObj.images.forEach((imgObj) => {
            if (imgObj?.imageUrl && !imgs.includes(imgObj.imageUrl)) {
              imgs.push(imgObj.imageUrl);
            }
          });
        } else if (activeColObj.imageUrl) {
          imgs.push(activeColObj.imageUrl);
        }
        if (imgs.length > 0) {
          return imgs;
        }
      }
    }

    // Fallback to general product images if no color is active or has images
    const imgs = [];
    if (Array.isArray(produit.images)) {
      produit.images.forEach((img) => {
        if (img && typeof img === "string" && !imgs.includes(img)) {
          imgs.push(img);
        }
      });
    }

    if (produit.imageUrl && !imgs.includes(produit.imageUrl)) {
      imgs.push(produit.imageUrl);
    }

    const filtered = imgs.filter(Boolean);
    return filtered.length > 0 ? filtered : [defaultImage];
  }, [produit, activeColor, defaultImage]);

  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Reset index if it exceeds list size
  React.useEffect(() => {
    if (currentIndex >= finalImages.length) {
      setCurrentIndex(0);
    }
  }, [finalImages, currentIndex]);

  // Set up staggered auto-sliding interval
  React.useEffect(() => {
    if (finalImages.length <= 1) return;

    const hash = produit.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const offset = hash % 800; // delay initial start to stagger transitions

    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % finalImages.length);
      }, 3000);
    }, offset);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [finalImages, produit.id]);

  const handleColorClick = (couleur) => {
    const name = typeof couleur === "object" ? couleur.nom : couleur;
    const img = typeof couleur === "object" && couleur.imageUrl ? couleur.imageUrl : null;
    setActiveColor(name);
    if (img) {
      const idx = finalImages.indexOf(img);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  };

  const handleFavori = (e) => {
    e.preventDefault();
    toggleFavori(produit.id);
    addToast(
      favoriActive ? "Retiré des favoris" : "Ajouté aux favoris",
      favoriActive ? "💔" : "❤️"
    );
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    ajouterAuPanier({
      produitId: produit.id,
      nom: produit.nom,
      prix: produit.prix,
      imageUrl: finalImages[currentIndex] || defaultImage,
      couleur: activeColor,
      quantite: 1,
    });
    addToast(`${produit.nom} ajouté au panier`, "🛍️");
  };

  return (
    <article className="group carte-produit-anim">
      {/* ── IMAGE ZONE ── */}
      <div className="relative overflow-hidden rounded-[20px] bg-[#f0ede6]">
        <Link to={`/produit/${produit.id}`} className="block relative aspect-[3/4] w-full overflow-hidden">
          {finalImages.map((imgUrl, idx) => (
            <img
              key={imgUrl}
              src={imgUrl}
              alt={produit.nom}
              loading={idx === 0 ? "eager" : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out ${
                idx === currentIndex
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-95 z-0 pointer-events-none"
              } group-hover:scale-[1.04]`}
            />
          ))}
        </Link>

        {/* Badge */}
        <span className="absolute left-3 top-3 badge badge-new badge-anim z-20">
          {badge}
        </span>

        {/* Favorite button */}
        <button
          type="button"
          onClick={handleFavori}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 ${
            favoriActive
              ? "bg-[#c9a84c] text-white opacity-100"
              : "bg-white/90 text-[#080808] sm:opacity-0 group-hover:opacity-100"
          }`}
          aria-label="Ajouter aux favoris"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill={favoriActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
            <path d="M20.8 5.6c-1.7-2-4.8-1.8-6.4.3L12 8.8 9.6 5.9C8 3.8 4.9 3.6 3.2 5.6c-1.9 2.2-1.5 5.6.7 7.5l8.1 7 8.1-7c2.2-1.9 2.6-5.3.7-7.5Z" />
          </svg>
        </button>

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
          <div className="flex gap-2 p-3">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="flex-1 rounded-full bg-[#080808]/90 backdrop-blur-sm py-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-[#080808]"
            >
              + Panier
            </button>
            <Link
              to={`/produit/${produit.id}`}
              className="flex-1 rounded-full bg-white/90 backdrop-blur-sm py-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#080808] transition-all duration-200 hover:bg-white"
            >
              Voir plus
            </Link>
          </div>
        </div>
      </div>

      {/* ── INFO ZONE ── */}
      <div className="px-1 pt-4">
        {/* Color swatches */}
        <div className="flex items-center gap-1.5">
          {couleurs.slice(0, 6).map((couleur, index) => {
            const hex = typeof couleur === "string" ? couleur : couleur.hex;
            const label = typeof couleur === "string" ? `Couleur ${index + 1}` : couleur.nom;
            const isActive = activeColor === label;
            return (
              <button
                key={`${hex}-${label}`}
                title={label}
                type="button"
                onClick={() => handleColorClick(couleur)}
                className={`h-3.5 w-3.5 rounded-full border transition-all duration-200 ${
                  isActive
                    ? "border-[#080808] scale-125 ring-2 ring-offset-1 ring-[#c9a84c]"
                    : "border-[#d0cac0] hover:scale-110"
                }`}
                style={{ backgroundColor: hex || "#ddd" }}
              />
            );
          })}
        </div>

        {/* Name & price */}
        <Link
          to={`/produit/${produit.id}`}
          className="mt-3 block text-sm font-medium text-[#080808] transition-colors duration-200 hover:text-[#c9a84c] leading-snug"
        >
          {produit.nom}
        </Link>
        <p className="mt-1 text-sm font-semibold text-[#c9a84c]">{formatPrice(produit.prix)}</p>
      </div>
    </article>
  );
}
