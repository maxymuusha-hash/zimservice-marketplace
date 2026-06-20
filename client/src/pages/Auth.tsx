import { useState } from "react";
import { supabase } from "@/supabase";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Briefcase } from "lucide-react";

type Mode = "signin" | "signup" | "forgot";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async () => {
    if (!email) { toast.error("Please enter your email"); return; }
    if (mode !== "forgot" && !password) { toast.error("Please enter your password"); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in successfully!");
        setLocation("/dashboard");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success("Password reset email sent! Check your inbox.");
        setMode("signin");
      }
    } catch (e: any) {
      toast.error(e.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    signin: "Welcome back",
    signup: "Create your account",
    forgot: "Reset your password",
  };

  const buttonLabels = {
    signin: "Sign In",
    signup: "Create Account",
    forgot: "Send Reset Email",
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f7ff, #ffffff)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: "#fff", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Briefcase size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0F172A", margin: 0, fontFamily: "Playfair Display, serif" }}>ZimService</h1>
          <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>{titles[mode]}</p>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: "14px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", border: "2px solid #E2E8F0", borderRadius: "10px", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          )}
          <div>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", border: "2px solid #E2E8F0", borderRadius: "10px", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          {mode !== "forgot" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>Password</label>
                {mode === "signin" && (
                  <button
                    onClick={() => setMode("forgot")}
                    style={{ fontSize: "13px", color: "#3B82F6", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{ width: "100%", padding: "12px 16px", border: "2px solid #E2E8F0", borderRadius: "10px", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "14px", borderRadius: "10px", fontSize: "16px", fontWeight: 700, cursor: "pointer", marginTop: "8px", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Please wait..." : buttonLabels[mode]}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          {mode === "forgot" ? (
            <button onClick={() => setMode("signin")} style={{ fontSize: "14px", color: "#3B82F6", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
              ← Back to Sign In
            </button>
          ) : (
            <>
              <span style={{ fontSize: "14px", color: "#64748B" }}>
                {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
              </span>
              <button
                onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                style={{ fontSize: "14px", color: "#3B82F6", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
              >
                {mode === "signup" ? "Sign In" : "Sign Up"}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setLocation("/")}
          style={{ display: "block", width: "100%", textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#94A3B8", background: "none", border: "none", cursor: "pointer" }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
