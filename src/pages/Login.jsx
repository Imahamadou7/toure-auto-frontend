import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { FiLock, FiUser } from "react-icons/fi";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const username = form.username.trim();

    if (!username || !form.password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);

      await login(username, form.password);

      toast.success("Connexion réussie");

      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("Erreur de connexion :", err);

      toast.error(
        err?.response?.data?.error ||
          err?.message ||
          "Connexion impossible"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <form
        onSubmit={submit}
        className="card p-8 w-full max-w-md space-y-4"
      >
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-copper-600 text-white grid place-items-center mb-3">
            <FiLock size={22} />
          </div>

          <h1 className="font-extrabold text-2xl text-ink-900">
            Espace administrateur
          </h1>

          <p className="text-sm text-ink-800/60">
            Toure Auto Service SARL
          </p>
        </div>

        <div>
          <label className="label">
            Nom d'utilisateur
          </label>

          <div className="relative">
            <FiUser
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-800/40"
            />

            <input
              className="input pl-9"
              autoComplete="username"
              value={form.username}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="label">
            Mot de passe
          </label>

          <input
            type="password"
            className="input"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}