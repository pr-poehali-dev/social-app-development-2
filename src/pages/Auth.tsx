import { useState } from "react";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/e24a9f57-7838-4ca8-8e1d-8b6aa03744e0";

interface AuthProps {
  onLogin: (token: string, user: UserData) => void;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

export default function Auth({ onLogin }: AuthProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ username: "", email: "", password: "", display_name: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${AUTH_URL}?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка входа"); return; }
      localStorage.setItem("vibe_token", data.token);
      onLogin(data.token, data.user);
    } catch {
      setError("Ошибка сети. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${AUTH_URL}?action=register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...regForm,
          display_name: regForm.display_name || regForm.username,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка регистрации"); return; }
      localStorage.setItem("vibe_token", data.token);
      onLogin(data.token, data.user);
    } catch {
      setError("Ошибка сети. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4" style={{ background: "#0a0a0f" }}>
      {/* Ambient blobs */}
      <div className="fixed w-96 h-96 rounded-full pointer-events-none" style={{ background: "rgba(168,85,247,0.2)", filter: "blur(80px)", top: "-100px", left: "-100px" }} />
      <div className="fixed w-80 h-80 rounded-full pointer-events-none" style={{ background: "rgba(236,72,153,0.15)", filter: "blur(80px)", bottom: "-80px", right: "-80px" }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-display text-5xl font-black gradient-text mb-2">VIBE</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            {mode === "login" ? "Войди и поймай волну" : "Создай свой аккаунт"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-2xl p-1 mb-6" style={{ background: "rgba(255,255,255,0.06)" }}>
          {(["login", "register"] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={mode === m
                ? { background: "linear-gradient(135deg, #a855f7, #ec4899)", color: "white", boxShadow: "0 4px 15px rgba(168,85,247,0.4)" }
                : { color: "rgba(255,255,255,0.45)" }
              }
            >
              {m === "login" ? "Войти" : "Регистрация"}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-2xl text-sm flex items-center gap-2" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
            <Icon name="AlertCircle" size={16} />
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <div className="relative">
              <Icon name="Mail" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.35)" }} />
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                required
                className="w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            <div className="relative">
              <Icon name="Lock" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.35)" }} />
              <input
                type="password"
                placeholder="Пароль"
                value={loginForm.password}
                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                required
                className="w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-display font-bold text-sm tracking-wide text-white mt-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)", boxShadow: "0 8px 30px rgba(168,85,247,0.4)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Входим...
                </span>
              ) : "ВОЙТИ"}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <div className="relative">
              <Icon name="User" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.35)" }} />
              <input
                type="text"
                placeholder="Имя пользователя (логин)"
                value={regForm.username}
                onChange={e => setRegForm(p => ({ ...p, username: e.target.value.replace(/\s/g, "") }))}
                required
                minLength={3}
                className="w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            <div className="relative">
              <Icon name="Smile" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.35)" }} />
              <input
                type="text"
                placeholder="Отображаемое имя"
                value={regForm.display_name}
                onChange={e => setRegForm(p => ({ ...p, display_name: e.target.value }))}
                className="w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            <div className="relative">
              <Icon name="Mail" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.35)" }} />
              <input
                type="email"
                placeholder="Email"
                value={regForm.email}
                onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                required
                className="w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            <div className="relative">
              <Icon name="Lock" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.35)" }} />
              <input
                type="password"
                placeholder="Пароль (мин. 6 символов)"
                value={regForm.password}
                onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))}
                required
                minLength={6}
                className="w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-display font-bold text-sm tracking-wide text-white mt-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)", boxShadow: "0 8px 30px rgba(168,85,247,0.4)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Создаём аккаунт...
                </span>
              ) : "СОЗДАТЬ АККАУНТ"}
            </button>
          </form>
        )}

        <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.25)" }}>
          Продолжая, вы соглашаетесь с условиями использования
        </p>
      </div>
    </div>
  );
}
