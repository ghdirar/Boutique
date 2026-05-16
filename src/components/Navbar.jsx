import { Link, NavLink } from "react-router-dom";
import { usePanier } from "../context/PanierContext";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/panier", label: "Panier" },
];

export default function Navbar() {
  const { nombreArticles } = usePanier();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/75 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-or text-lg font-black text-black">
            M
          </span>
          <div>
            <p className="text-lg font-bold text-white">Magsin Couture</p>
            <p className="text-xs uppercase tracking-[0.35em] text-or">Mode elegante</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-or" : "text-white/70 hover:text-white"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/panier" className="relative btn-primary">
            Panier
            {nombreArticles > 0 && (
              <span className="absolute -right-1 -top-2 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-black">
                {nombreArticles}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
