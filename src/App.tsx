import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Auth, { UserData } from "./pages/Auth";

const queryClient = new QueryClient();

const AUTH_URL = "https://functions.poehali.dev/e24a9f57-7838-4ca8-8e1d-8b6aa03744e0";

const App = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vibe_token");
    if (!token) { setChecking(false); return; }
    fetch(`${AUTH_URL}?action=me`, {
      headers: { "X-Auth-Token": token },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.id) setUser(data); })
      .finally(() => setChecking(false));
  }, []);

  const handleLogin = (_token: string, userData: UserData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    const token = localStorage.getItem("vibe_token");
    if (token) {
      fetch(`${AUTH_URL}?action=logout`, {
        method: "DELETE",
        headers: { "X-Auth-Token": token },
      });
    }
    localStorage.removeItem("vibe_token");
    setUser(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="font-display text-2xl font-black gradient-text animate-pulse">VIBE</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {user ? (
          <Index user={user} onLogout={handleLogout} />
        ) : (
          <Auth onLogin={handleLogin} />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
