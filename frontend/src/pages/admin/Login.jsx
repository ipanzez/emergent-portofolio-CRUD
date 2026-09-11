import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";
import { DarkBackdrop, Sparkle } from "@/components/public/DarkBackdrop";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/admin/Shared";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={location.state?.from?.pathname || "/admin"} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(form.username, form.password);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (err) {
      setError(formatApiError(err, "Login failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center px-6">
      <DarkBackdrop />
      <form onSubmit={submit} data-testid="login-form" className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-lift md:p-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white"><Sparkle size={16} className="text-blue-300" /></span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Sign in to manage your portfolio</p>
          </div>
        </div>
        <div className="space-y-4">
          <Field id="login-username" label="Username" autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <Field id="login-password" label="Password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error && <p data-testid="login-error" className="mt-4 rounded-xl bg-rose-soft/60 px-4 py-2.5 text-sm font-medium text-rose-deep">{error}</p>}
        <Button data-testid="login-submit-btn" type="submit" disabled={busy} className="mt-6 h-11 w-full rounded-xl bg-ink text-white hover:bg-gray-800">
          <Lock size={15} className="mr-2" /> {busy ? "Signing in…" : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
