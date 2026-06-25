import { useState, useEffect } from "react";
import { supabase } from "@/supabase";
import { useLocation } from "wouter";
import { LayoutDashboard, LogOut, Wrench, Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const navigate = (path: string) => {
    setLocation(path);
    setMenuOpen(false);
  };

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E2E8F0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>

        {/* Logo */}
        <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "16px" }}>Z</div>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A" }}>ZimService</span>
        </button>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }} className="desktop-nav">
          <button onClick={() => navigate("/services")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#64748B", padding: "8px 12px", borderRadius: "8px", fontWeight: 500 }}>
            Browse Services
          </button>
          {user ? (
            <>
              <button onClick={() => navigate("/dashboard")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#64748B", padding: "8px 12px", borderRadius: "8px", fontWeight: 500 }}>
                <LayoutDashboard size={15} /> Dashboard
              </button>
              <button onClick={() => navigate("/provider/onboarding")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#64748B", padding: "8px 12px", borderRadius: "8px", fontWeight: 500 }}>
                <Wrench size={15} /> Become Provider
              </button>
              <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA", padding: "8px 14px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/auth")} style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              Sign In
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: "8px", display: "none" }}
        >
          {menuOpen ? <X size={24} color="#0F172A" /> : <Menu size={24} color="#0F172A" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-dropdown" style={{ background: "#fff", borderTop: "1px solid #E2E8F0", padding: "12px 20px 20px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <button onClick={() => navigate("/services")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: "#0F172A", padding: "12px 0", textAlign: "left", fontWeight: 500, borderBottom: "1px solid #F1F5F9" }}>
            Browse Services
          </button>
          {user ? (
            <>
              <button onClick={() => navigate("/dashboard")} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: "#0F172A", padding: "12px 0", textAlign: "left", fontWeight: 500, borderBottom: "1px solid #F1F5F9" }}>
                <LayoutDashboard size={16} /> Dashboard
              </button>
              <button onClick={() => navigate("/provider/onboarding")} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: "#0F172A", padding: "12px 0", textAlign: "left", fontWeight: 500, borderBottom: "1px solid #F1F5F9" }}>
                <Wrench size={16} /> Become a Provider
              </button>
              <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA", padding: "12px 16px", borderRadius: "10px", fontSize: "15px", fontWeight: 600, cursor: "pointer", marginTop: "8px" }}>
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/auth")} style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 600, cursor: "pointer", marginTop: "8px" }}>
              Sign In
            </button>
          )}
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-dropdown { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
