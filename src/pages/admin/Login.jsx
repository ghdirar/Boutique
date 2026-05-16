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
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F3] px-4 animate-page">
      <div className="card-surface w-full max-w-lg p-8 animate-scale-in">
        <p className="text-sm uppercase tracking-[0.35em] text-or animate-fade-up">Administration</p>
        <h1 className="mt-4 text-4xl font-bold animate-fade-up delay-150">Connexion admin</h1>
        <p className="mt-3 text-[#6B6B6B] animate-fade-up delay-300">Seul un compte Firebase Auth autorisé peut accéder à l'administration.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5 animate-fade-up delay-500">
          <label className="block space-y-2">
            <span className="text-sm text-[#6B6B6B]">Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input-base" required />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-[#6B6B6B]">Mot de passe</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input-base" required />
          </label>

          {authError && <p className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">{authError}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
