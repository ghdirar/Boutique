import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import Accueil from "./pages/Accueil";
import Catalogue from "./pages/Catalogue";
import Produit from "./pages/Produit";
import Panier from "./pages/Panier";
import Commande from "./pages/Commande";
import Confirmation from "./pages/Confirmation";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProduitsAdmin from "./pages/admin/Produits";
import AjouterProduit from "./pages/admin/AjouterProduit";
import ModifierProduit from "./pages/admin/ModifierProduit";
import CommandesAdmin from "./pages/admin/Commandes";

function ClientLayout() {
  return (
    <div className="min-h-screen bg-noir text-white">
      <Navbar />
      <main className="mx-auto min-h-[calc(100vh-180px)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

function RouterView() {
  const location = useLocation();

  return (
    <div key={location.pathname}>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Accueil />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/produit/:id" element={<Produit />} />
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
