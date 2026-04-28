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
        body: JSON.stringify({ ...regForm, display_name: regForm.display_name || regForm.username }),
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
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{ background: "linear-gradient(135deg, #ede9fe 0%, #e0e7ff 40%, #bae6fd 100%)" }}>

      {/* Blobs */}
      <div className="blob w-96 h-96" style={{ background: "rgba(167,139,250,0.45)", top: "-120px", left: "-120px" }} />
      <div className="blob w-80 h-80" style={{ background: "rgba(251,113,133,0.3)", bottom: "-80px", right: "-80px", animationDelay: "4s" }} />
      <div className="blob w-64 h-64" style={{ background: "rgba(56,189,248,0.25)", top: "40%", right: "10%", animationDelay: "7s" }} />

      <div className="relative z-10 w-full max-w-sm animate-fade-in-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 glass-strong"
            style={{ boxShadow: "0 12px 40px rgba(124,58,237,0.25)" }}>
            <span className="text-3xl">✦</span>
          </div>
          <h1 className="font-display text-4xl font-black gradient-text mb-1">VIBE</h1>
          <p className="text-sm" style={{ color: "rgba(80,60,160,0.6)" }}>
            {mode === "login" ? "Добро пожаловать обратно" : "Присоединяйся к сообществу"}
          </p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-6" style={{ boxShadow: "0 20px 60px rgba(100,80,200,0.18)" }}>

          {/* Tab switcher */}
          <div className="flex rounded-2xl p-1 mb-5" style={{ background: "rgba(100,80,200,0.08)" }}>
            {(["login", "register"] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={mode === m
                  ? { background: "linear-gradient(135deg, #7c3aed, #6366f1)", color: "white", boxShadow: "0 4px 15px rgba(124,58,237,0.35)" }
                  : { color: "rgba(80,60,160,0.55)" }
                }
              >
                {m === "login" ? "Войти" : "Регистрация"}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-2xl text-sm flex items-center gap-2"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}>
              <Icon name="AlertCircle" size={15} />
              {error}
            </div>
          )}

          {/* LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <div className="relative">
                <Icon name="Mail" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(100,80,200,0.45)" }} />
                <input
                  type="email" placeholder="Email"
                  value={loginForm.email}
                  onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                  required
                  className="glass-input w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm"
                />
              </div>
              <div className="relative">
                <Icon name="Lock" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(100,80,200,0.45)" }} />
                <input
                  type="password" placeholder="Пароль"
                  value={loginForm.password}
                  onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                  required
                  className="glass-input w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl font-display font-bold text-sm tracking-wide text-white mt-1 btn-primary disabled:opacity-60"
              >
                {loading
                  ? <span className="flex items-center justify-center gap-2"><Icon name="Loader2" size={15} className="animate-spin" />Входим...</span>
                  : "ВОЙТИ"}
              </button>
            </form>
          )}

          {/* REGISTER */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="flex flex-col gap-3">
              <div className="relative">
                <Icon name="AtSign" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(100,80,200,0.45)" }} />
                <input
                  type="text" placeholder="Имя пользователя"
                  value={regForm.username}
                  onChange={e => setRegForm(p => ({ ...p, username: e.target.value.replace(/\s/g, "") }))}
                  required minLength={3}
                  className="glass-input w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm"
                />
              </div>
              <div className="relative">
                <Icon name="Smile" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(100,80,200,0.45)" }} />
                <input
                  type="text" placeholder="Отображаемое имя"
                  value={regForm.display_name}
                  onChange={e => setRegForm(p => ({ ...p, display_name: e.target.value }))}
                  className="glass-input w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm"
                />
              </div>
              <div className="relative">
                <Icon name="Mail" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(100,80,200,0.45)" }} />
                <input
                  type="email" placeholder="Email"
                  value={regForm.email}
                  onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                  required
                  className="glass-input w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm"
                />
              </div>
              <div className="relative">
                <Icon name="Lock" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(100,80,200,0.45)" }} />
                <input
                  type="password" placeholder="Пароль (мин. 6 символов)"
                  value={regForm.password}
                  onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))}
                  required minLength={6}
                  className="glass-input w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl font-display font-bold text-sm tracking-wide text-white mt-1 btn-primary disabled:opacity-60"
              >
                {loading
                  ? <span className="flex items-center justify-center gap-2"><Icon name="Loader2" size={15} className="animate-spin" />Создаём аккаунт...</span>
                  : "СОЗДАТЬ АККАУНТ"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs mt-5" style={{ color: "rgba(100,80,180,0.4)" }}>
          Продолжая, вы соглашаетесь с условиями использования
        </p>
      </div>
    </div>
  );
}
