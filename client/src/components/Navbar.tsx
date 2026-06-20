import { useState, useEffect } from "react";
import { supabase } from "@/supabase";
import { useLocation } from "wouter";
import { LayoutDashboard, LogOut, Wrench } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/");
  };

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E2E8F0", padding: "0 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
        
        <button onClick={() => setLocation("/")} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "16px" }}>Z</div>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A" }}>ZimService</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={() => setLocation("/services")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#64748B", padding: "8px 12px", borderRadius: "8px" }}>
            Browse Services
          </button>

          {user ? (
            <>
              <button onClick={() => setLocation("/dashboard")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#64748B", padding: "8px 12px", borderRadius: "8px" }}>
                <LayoutDashboard size={16} /> Dashboard
              </button>
              <button onClick={() => setLocation("/provider/onboarding")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#64748B", padding: "8px 12px", borderRadius: "8px" }}>
                <Wrench size={16} /> Become Provider
              </button>
              <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA", padding: "8px 14px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => setLocation("/auth")} style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
