import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { usePanier } from "../context/PanierContext";
import { useFavoris } from "../context/FavorisContext";

const mainLinks = [
  { to: "/catalogue", label: "Nouveautés" },
  { to: "/catalogue?categorie=sacs-main", label: "Sac à la main" },
  { to: "/catalogue", label: "Collections" },
];

export default function Navbar() {
  const { nombreArticles } = usePanier();
  const { favoris } = useFavoris();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close search overlay whenever the route changes
  useEffect(() => {
    setIsSearchOpen(false);
    setIsMobileOpen(false);
  }, [location.pathname, location.search]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Close overlay + go to catalogue results on Enter
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsSearchOpen(false);
      navigate(`/catalogue?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  };

  const handleSearchSubmit = () => {
    setIsSearchOpen(false);
    navigate(`/catalogue?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      {/* ── PROMO BANNER ── */}
      <div className="promo-banner">
        <span>✨ Paiement à la livraison &nbsp;•&nbsp; Livraison partout en Algérie &nbsp;•&nbsp; 3 articles achetés = Livraison gratuite </span>
      </div>

      {/* ── MAIN HEADER ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-2xl shadow-[0_2px_24px_rgba(8,8,8,0.06)] border-b border-black/[0.03]"
            : "bg-white/70 backdrop-blur-xl border-b border-black/[0.04]"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-10">
          {/* ── NAV LEFT ── */}
          <nav className="hidden items-center gap-8 lg:flex">
            {mainLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `relative text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive ? "text-[#c9a84c]" : "text-[#080808] hover:text-[#c9a84c]"
                  } after:absolute after:bottom-[-3px] after:left-0 after:h-[1px] after:w-0 after:bg-[#c9a84c] after:transition-all after:duration-300 hover:after:w-full`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* ── LOGO ── */}
          <Link to="/" className="text-left lg:text-center">
            <p className="font-serif text-[20px] sm:text-[24px] lg:text-[30px] font-medium uppercase tracking-[0.22em] text-[#080808] leading-none">
              La Votre
            </p>
            <p className="text-[7px] sm:text-[8px] font-medium uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#c9a84c] mt-1 lg:mt-0.5" style={{ marginTop: "3px" }}>
              Elle est déjà la vôtre
            </p>
          </Link>

          {/* ── ACTIONS RIGHT ── */}
          <div className="flex items-center justify-end gap-3 sm:gap-5">
            {/* Search pill */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden items-center gap-2.5 rounded-full border border-black/[0.07] bg-black/[0.02] px-4 py-2 text-[12px] text-[#7a7368] transition-all duration-300 hover:bg-black/[0.04] hover:border-black/15 sm:flex"
              aria-label="Rechercher"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" />
              </svg>
              <span>Rechercher</span>
            </button>

            {/* Search mobile icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/[0.04] transition-colors sm:hidden"
              aria-label="Rechercher"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" />
              </svg>
            </button>

            {/* Favorites */}
            <Link
              to="/favoris"
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-black/[0.04]"
              aria-label="Favoris"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.8 5.6c-1.7-2-4.8-1.8-6.4.3L12 8.8 9.6 5.9C8 3.8 4.9 3.6 3.2 5.6c-1.9 2.2-1.5 5.6.7 7.5l8.1 7 8.1-7c2.2-1.9 2.6-5.3.7-7.5Z" />
              </svg>
              {favoris.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#c9a84c] text-[9px] font-bold leading-none text-white">
                  {favoris.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/panier"
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-black/[0.04]"
              aria-label="Panier"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6.5 8.5h11l1 12h-13l1-12Z" /><path d="M9 8.5v-2a3 3 0 0 1 6 0v2" />
              </svg>
              {nombreArticles > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#080808] text-[9px] font-bold leading-none text-white animate-scale-in">
                  {nombreArticles}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full transition-all hover:bg-black/[0.04] lg:hidden"
              aria-label="Menu"
            >
              <span className="block h-[1.5px] w-5 bg-[#080808]" />
              <span className="block h-[1.5px] w-4 bg-[#080808]" />
              <span className="block h-[1.5px] w-5 bg-[#080808]" />
            </button>
          </div>
        </div>
      </header>

      {/* ── SEARCH OVERLAY ── */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-start bg-black/30 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full bg-white shadow-2xl px-5 py-5 lg:px-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex max-w-2xl items-center gap-4">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#c9a84c]" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" />
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="Rechercher un article... (Entrée pour voir les résultats)"
                className="flex-1 bg-transparent text-base outline-none placeholder:text-[#a09a91]"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
              />
              <button
                onClick={handleSearchSubmit}
                className="rounded-full bg-[#080808] px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-white transition hover:bg-[#c9a84c]"
              >
                Chercher
              </button>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="rounded-full bg-black/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-[#080808] transition hover:bg-black/[0.08]"
              >
                ✕
              </button>
            </div>
            {/* Quick hint */}
            <p className="mx-auto mt-2 max-w-2xl pl-9 text-[11px] text-[#a09a91]">
              Appuyez sur <kbd className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[10px]">Entrée</kbd> pour voir tous les résultats
            </p>
          </div>
        </div>
      )}

      {/* ── MOBILE MENU ── */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[70] flex animate-fade-in lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="relative ml-auto h-full w-[300px] bg-white shadow-2xl flex flex-col animate-slide-right">
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.04]">
              <p className="font-serif text-xl uppercase tracking-[0.18em]">La Votre</p>
              <button onClick={() => setIsMobileOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/[0.05]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col px-6 py-8 gap-6">
              {mainLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-sm font-semibold uppercase tracking-[0.2em] text-[#080808] hover:text-[#c9a84c] transition-colors"
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="px-6 mt-auto pb-10 space-y-3">
              <Link to="/favoris" onClick={() => setIsMobileOpen(false)} className="btn-secondary w-full block text-center">Mes Favoris ({favoris.length})</Link>
              <Link to="/panier" onClick={() => setIsMobileOpen(false)} className="btn-primary w-full block text-center">Panier ({nombreArticles})</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
