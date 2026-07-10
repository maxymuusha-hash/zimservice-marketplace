import { useState, useEffect } from "react";
import { supabase } from "@/supabase";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowRight, Shield, Star, MapPin } from "lucide-react";

type Mode = "signin" | "signup" | "forgot" | "reset";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace("#", "?"));
    const type = hashParams.get("type");
    if (type === "recovery") setMode("reset");
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!email || !password) { toast.error("Please fill in all fields"); return; }
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
      } else if (mode === "signin") {
        if (!email || !password) { toast.error("Please fill in all fields"); return; }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in successfully!");
        setLocation("/dashboard");
      } else if (mode === "forgot") {
        if (!email) { toast.error("Please enter your email"); return; }
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` });
        if (error) throw error;
        toast.success("Password reset email sent! Check your inbox.");
        setMode("signin");
      } else if (mode === "reset") {
        if (!password || !confirmPassword) { toast.error("Please fill in all fields"); return; }
        if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
        if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast.success("Password updated! Please sign in.");
        setMode("signin");
      }
    } catch (e: any) {
      toast.error(e.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "2px solid #E2E8F0",
    borderRadius: "12px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box" as const,
    fontFamily: "Inter, sans-serif",
    transition: "border-color 0.2s",
    background: "#FAFAFA",
    color: "#0F172A",
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: 600 as const,
    color: "#374151",
    display: "block" as const,
    marginBottom: "8px",
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", display: "flex" }}>

      {/* Left panel — branding */}
      <div style={{ flex: 1, background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E1B4B 100%)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px", position: "relative", overflow: "hidden" }} className="hidden-mobile">
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-40px", width: "280px", height: "280px", background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)", borderRadius: "50%" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
            <div style={{ width: "44px", height: "44px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "18px", color: "#fff" }}>SS</div>
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#fff" }}>SmartServ</span>
          </div>

          <h1 style={{ fontSize: "44px", fontWeight: 800, color: "#fff", margin: "0 0 16px", fontFamily: "Playfair Display, serif", lineHeight: 1.15 }}>
            Zimbabwe's Smartest<br />
            <span style={{ background: "linear-gradient(135deg, #60A5FA, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Service Marketplace
            </span>
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "48px", maxWidth: "360px" }}>
            Connect with verified local providers for household chores, repairs, personal care, and skilled trades.
          </p>

          {/* Trust signals */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { icon: Shield, text: "Verified & background-checked providers", color: "#34D399" },
              { icon: Star, text: "Rated & reviewed by real customers", color: "#FBBF24" },
              { icon: MapPin, text: "Local to Zimbabwe — built for the local market", color: "#60A5FA" },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color={color} />
                </div>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", background: "#fff" }}>

        {/* Mobile logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
          <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px", color: "#fff" }}>SS</div>
          <span style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A" }}>SmartServ</span>
        </div>

        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px", fontFamily: "Playfair Display, serif" }}>
          {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create account" : mode === "forgot" ? "Reset password" : "Set new password"}
        </h2>
        <p style={{ fontSize: "14px", color: "#64748B", margin: "0 0 32px" }}>
          {mode === "signin" ? "Sign in to your SmartServ account" : mode === "signup" ? "Create your free SmartServ account" : mode === "forgot" ? "We'll send you a reset link" : "Enter your new password below"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {mode === "signup" && (
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            </div>
          )}

          {(mode === "signin" || mode === "signup" || mode === "forgot") && (
            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            </div>
          )}

          {(mode === "signin" || mode === "signup") && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                {mode === "signin" && (
                  <button onClick={() => setMode("forgot")} style={{ fontSize: "13px", color: "#3B82F6", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} style={inputStyle} />
            </div>
          )}

          {mode === "reset" && (
            <>
              <div>
                <label style={labelStyle}>New Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} style={inputStyle} />
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: loading ? "#94A3B8" : "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "16px", borderRadius: "12px", fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 16px rgba(99,102,241,0.4)", transition: "all 0.2s" }}
          >
            {loading ? "Please wait..." : (
              <>
                {mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : mode === "forgot" ? "Send Reset Email" : "Update Password"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "28px" }}>
          {mode === "forgot" || mode === "reset" ? (
            <button onClick={() => setMode("signin")} style={{ fontSize: "14px", color: "#3B82F6", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
              ← Back to Sign In
            </button>
          ) : (
            <span style={{ fontSize: "14px", color: "#64748B" }}>
              {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
              <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} style={{ fontSize: "14px", color: "#3B82F6", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
                {mode === "signup" ? "Sign In" : "Sign Up Free"}
              </button>
            </span>
          )}
        </div>

        <button onClick={() => setLocation("/")} style={{ display: "block", width: "100%", textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#94A3B8", background: "none", border: "none", cursor: "pointer" }}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
