import { useState } from "react";
import { Link } from "react-router-dom";
import { useFavoris } from "../context/FavorisContext";

function formatPrice(value) {
  return `${Number(value).toLocaleString("fr-FR")} DA`;
}

const fallbackSwatches = ["#efe3d2", "#1a1a1a", "#b58d73", "#6f765e"];

export default function CarteProduit({ produit }) {
  const couleurs = Array.isArray(produit.couleurs) && produit.couleurs.length ? produit.couleurs : fallbackSwatches;
  const badge = produit.badges?.[0] || "Nouveaute";

  const firstColorImage = couleurs.find((couleur) => typeof couleur === "object" && couleur.imageUrl)?.imageUrl;
  const defaultImage = firstColorImage || produit.images?.[0] || produit.imageUrl;

  const [activeImage, setActiveImage] = useState(defaultImage);
  const [activeColor, setActiveColor] = useState(() => {
    const first = couleurs[0];
    return typeof first === "object" ? first.nom : first;
  });
  const [imageLoading, setImageLoading] = useState(false);

  const { isFavori, toggleFavori } = useFavoris();
  const favoriActive = isFavori(produit.id);

  const handleColorClick = (couleur) => {
    const name = typeof couleur === "object" ? couleur.nom : couleur;
    const img = typeof couleur === "object" && couleur.imageUrl ? couleur.imageUrl : null;

    setActiveColor(name);
    if (img && img !== activeImage) {
      setImageLoading(true);
      setActiveImage(img);
    }
  };

  return (
    <article className="group cursor-pointer overflow-hidden bg-white carte-produit-anim">
      <div className="relative overflow-hidden bg-[#F5F5F3]">
        <Link to={`/produit/${produit.id}`} className="block">
          <img
            key={activeImage}
            src={activeImage}
            alt={produit.nom}
            loading="lazy"
            onLoad={() => setImageLoading(false)}
            className={`aspect-[4/5] w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-[1.03] ${imageLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}
          />
        </Link>

        <span className="absolute left-3 top-3 bg-white/90 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-[#6B6B6B] badge-anim">
          {badge}
        </span>

        <button 
          type="button" 
          onClick={(e) => { e.preventDefault(); toggleFavori(produit.id); }}
          className={`absolute right-3 top-3 transition-all duration-300 ease-in-out sm:opacity-0 group-hover:opacity-100 ${favoriActive ? "!opacity-100" : ""}`} 
          aria-label="Ajouter aux favoris"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill={favoriActive ? "#1A1A1A" : "none"} stroke="#1A1A1A" strokeWidth="1.5">
            <path d="M20.8 5.6c-1.7-2-4.8-1.8-6.4.3L12 8.8 9.6 5.9C8 3.8 4.9 3.6 3.2 5.6c-1.9 2.2-1.5 5.6.7 7.5l8.1 7 8.1-7c2.2-1.9 2.6-5.3.7-7.5Z" />
          </svg>
        </button>

        <Link
          to={`/produit/${produit.id}`}
          className="absolute inset-x-4 bottom-4 translate-y-2 bg-white/90 py-3 text-center text-[12px] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A] opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100"
        >
          Vue rapide
        </Link>
      </div>

      <div className="px-2 pt-4">
        <div className="flex gap-2">
          {couleurs.slice(0, 5).map((couleur, index) => {
            const hex = typeof couleur === "string" ? couleur : couleur.hex;
            const label = typeof couleur === "string" ? `Couleur ${index + 1}` : couleur.nom;
            const isActive = activeColor === label;
            return (
              <button
                key={`${hex}-${label}`}
                title={label}
                type="button"
                onClick={() => handleColorClick(couleur)}
                className={`h-4 w-4 rounded-full border-2 transition-all duration-200 swatch-btn ${isActive ? "border-[#1A1A1A] scale-110" : "border-[#E8E8E8] hover:border-[#aaa] hover:scale-110"}`}
                style={{ backgroundColor: hex || "#ddd" }}
              />
            );
          })}
        </div>
        <Link to={`/produit/${produit.id}`} className="mt-3 block text-sm text-[#1A1A1A] transition-opacity duration-300 hover:opacity-70">
          {produit.nom}
        </Link>
        <p className="mt-1 text-sm text-[#1A1A1A]">{formatPrice(produit.prix)}</p>
      </div>
    </article>
  );
}
