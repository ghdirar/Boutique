import { useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { usePanier } from "../context/PanierContext";
import { useFavoris } from "../context/FavorisContext";

const mainLinks = [
  { to: "/catalogue", label: "Nouveautés" },
  { to: "/catalogue?categorie=sacs-main", label: "Sac à la main" },
  { to: "/catalogue", label: "Collections" },
];

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.8 5.6c-1.7-2-4.8-1.8-6.4.3L12 8.8 9.6 5.9C8 3.8 4.9 3.6 3.2 5.6c-1.9 2.2-1.5 5.6.7 7.5l8.1 7 8.1-7c2.2-1.9 2.6-5.3.7-7.5Z" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.6-4.2 4.2-6 8-6s6.4 1.8 8 6" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6.5 8.5h11l1 12h-13l1-12Z" />
      <path d="M9 8.5v-2a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export default function Navbar() {
  const { nombreArticles } = usePanier();
  const { favoris } = useFavoris();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    navigate(`/catalogue?q=${encodeURIComponent(value.trim())}`, { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-white text-[#1A1A1A]">
      <div className="relative grid h-[80px] grid-cols-[1fr_auto_1fr] items-center border-b border-[#E8E8E8] px-5 lg:px-12">
        <nav className="hidden h-full items-center gap-8 lg:flex">
          {mainLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className="text-[12px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300 hover:text-or"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="text-center">
          <p className="font-serif text-3xl uppercase tracking-[0.18em] sm:text-4xl">La Votre</p>
        </Link>

        <div className="flex items-center justify-end gap-6">
          {/* Static box that opens overlay */}
          <div 
            onClick={() => setIsSearchOpen(true)}
            className="relative hidden w-48 cursor-pointer items-center border border-[#1A1A1A] px-3 py-1.5 sm:flex"
          >
            <IconSearch />
            <span className="ml-2 text-[13px] text-[#6B6B6B]">Rechercher</span>
          </div>

          <div className="flex items-center gap-5">
            <Link to="/favoris" className="relative transition-opacity duration-300 hover:opacity-60" aria-label="Favoris">
              <IconHeart />
              {favoris.length > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-or text-[10px] leading-none text-white">
                  {favoris.length}
                </span>
              )}
            </Link>

            <Link to="/admin" className="transition-opacity duration-300 hover:opacity-60" aria-label="Compte">
              <IconUser />
            </Link>

            <Link to="/panier" className="relative transition-opacity duration-300 hover:opacity-60" aria-label="Panier">
              <IconBag />
              {nombreArticles > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-[#1A1A1A] text-[10px] leading-none text-white">
                  {nombreArticles}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Full Width Search Overlay */}
      {isSearchOpen && (
        <div className="animate-fade-in absolute inset-x-0 top-0 z-[60] flex h-[80px] items-center bg-white px-5 shadow-sm lg:px-12">
          <div className="mx-auto flex w-full max-w-7xl items-center border border-[#1A1A1A] px-4 py-2">
            <IconSearch />
            <input
              autoFocus
              type="text"
              placeholder="Rechercher..."
              className="ml-3 w-full bg-transparent text-lg outline-none placeholder:text-[#6B6B6B]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="ml-4 text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] hover:opacity-60"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
