import { useEffect } from "react";
import { Link, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import { useAuth } from "./context/AuthContext";
import Accueil from "./pages/Accueil";
import Catalogue from "./pages/Catalogue";
import Produit from "./pages/Produit";
import Panier from "./pages/Panier";
import Commande from "./pages/Commande";
import Confirmation from "./pages/Confirmation";
import Favoris from "./pages/Favoris";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProduitsAdmin from "./pages/admin/Produits";
import AjouterProduit from "./pages/admin/AjouterProduit";
import ModifierProduit from "./pages/admin/ModifierProduit";
import CommandesAdmin from "./pages/admin/Commandes";

function ClientLayout() {
  return (
    <div className="site-public min-h-screen text-[#080808]">
      <Navbar />
      <main className="min-h-[calc(100vh-180px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="admin-area min-h-screen text-[#080808] bg-[#f7f4ef]">
      {/* ── ADMIN MAIN HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl shadow-[0_2px_24px_rgba(8,8,8,0.05)] border-b border-black/[0.03]">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 lg:px-10">
          
          {/* Logo and Admin Badge */}
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="flex flex-col">
              <span className="font-serif text-xl font-medium uppercase tracking-[0.2em] text-[#080808] sm:text-2xl">
                La Votre
              </span>
              <span className="text-[7px] font-bold uppercase tracking-[0.35em] text-[#c9a84c] -mt-1">
                Administration
              </span>
            </Link>
            <span className="hidden rounded-full bg-[#c9a84c]/10 px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#c9a84c] border border-[#c9a84c]/20 sm:inline-block">
              Portail
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-5 sm:gap-8">
            {[
              { to: "/admin/dashboard", label: "Dashboard" },
              { to: "/admin/produits", label: "Produits" },
              { to: "/admin/commandes", label: "Commandes" },
            ].map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`relative text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive ? "text-[#c9a84c]" : "text-[#080808] hover:text-[#c9a84c]"
                  } after:absolute after:bottom-[-4px] after:left-0 after:h-[1.5px] after:transition-all after:duration-300 ${
                    isActive ? "after:w-full after:bg-[#c9a84c]" : "after:w-0 after:bg-[#c9a84c] hover:after:w-full"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions: user info and Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden flex-col text-right lg:flex">
              <span className="text-[8px] font-bold uppercase tracking-widest text-[#7a7368]">Compte</span>
              <span className="text-xs font-semibold text-[#080808] max-w-[140px] truncate">{user?.email}</span>
            </div>
            
            <button
              onClick={logout}
              className="rounded-full bg-[#080808] hover:bg-[#c9a84c] text-white hover:text-white px-4 sm:px-5 py-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 shadow-[0_4px_12px_rgba(8,8,8,0.1)] hover:shadow-[0_4px_16px_rgba(201,168,76,0.3)] active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="hidden sm:inline">Déconnexion</span>
              <svg viewBox="0 0 24 24" className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}

function RouterView() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div key={location.pathname}>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Accueil />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/produit/:id" element={<Produit />} />
          <Route path="/favoris" element={<Favoris />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/commande" element={<Commande />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="produits" element={<ProduitsAdmin />} />
          <Route path="produits/ajouter" element={<AjouterProduit />} />
          <Route path="produits/modifier/:id" element={<ModifierProduit />} />
          <Route path="commandes" element={<CommandesAdmin />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return <RouterView />;
}
