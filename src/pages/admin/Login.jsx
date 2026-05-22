import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, authError, isAdminAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      await login(email, password);
      navigate("/admin/dashboard", { replace: true });
    } catch {
      // Le message est exposé par AuthContext.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4 relative overflow-hidden animate-page">
      {/* Decorative ambient gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#c9a84c]/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md backdrop-blur-xl bg-[#0e0e0e]/80 border border-white/[0.06] rounded-[36px] p-10 shadow-2xl relative z-10 animate-scale-in">
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#c9a84c] animate-fade-up">
            Boutique de Luxe
          </p>
          <h1 className="mt-4 font-serif text-3xl font-medium uppercase tracking-[0.05em] text-white animate-fade-up delay-150">
            Administration
          </h1>
          <p className="mt-2 text-xs text-white/40 animate-fade-up delay-200">
            Veuillez vous authentifier pour accéder au dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 animate-fade-up delay-300">
          <div className="space-y-2">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
              Adresse Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full h-12 rounded-full px-5 bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all duration-300 placeholder-white/20"
              placeholder="admin@boutique.com"
              required
            />
          </div>

          <div className="space-y-2">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
              Mot de passe
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full h-12 rounded-full px-5 bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all duration-300 placeholder-••••••••"
              placeholder="••••••••"
              required
            />
          </div>

          {authError && (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-full bg-[#c9a84c] hover:bg-[#e2c46f] text-[#080808] font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_4px_20px_rgba(201,168,76,0.25)] hover:shadow-[0_8px_30px_rgba(201,168,76,0.4)] disabled:opacity-60 disabled:pointer-events-none mt-2"
          >
            {submitting ? "Connexion..." : "Se connecter →"}
          </button>
        </form>
      </div>
    </div>
  );
}
