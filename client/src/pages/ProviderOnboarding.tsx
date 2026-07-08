import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { CheckCircle, DollarSign, Star, Shield, ArrowRight, Zap } from "lucide-react";
import { getLoginUrl } from "@/const";

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  border: "2px solid #E2E8F0",
  borderRadius: "10px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box" as const,
  fontFamily: "Inter, sans-serif",
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

export default function ProviderOnboarding() {
  const { user, isAuthenticated, loading } = useAuth({ redirectOnUnauthenticated: false });
  const [, setLocation] = useLocation();
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location2, setLocation2] = useState("");

  const onboard = trpc.provider.onboard.useMutation();
  const utils = trpc.useUtils();
  const { data: subStatus } = trpc.subscription.status.useQuery(undefined, {
    enabled: isAuthenticated && !!user?.isProvider,
  });

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
        <Navbar />
        <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E1B4B 100%)", padding: "80px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", marginBottom: "16px", fontFamily: "Playfair Display, serif" }}>Sign in to become a SmartServ provider</h2>
          <button onClick={() => window.location.href = getLoginUrl()} style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "12px", fontSize: "16px", fontWeight: 600, cursor: "pointer" }}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const hasActiveSubscription = !!(
    subStatus?.status === "active" &&
    subStatus?.expiry &&
    new Date(subStatus.expiry) > new Date()
  );

  if (user?.isProvider) {
    if (hasActiveSubscription) {
      return (
        <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
          <Navbar />
          <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E1B4B 100%)", padding: "80px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)", borderRadius: "50%" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ width: "80px", height: "80px", background: "rgba(52,211,153,0.15)", border: "2px solid #34D399", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <CheckCircle size={40} color="#34D399" />
              </div>
              <div style={{ display: "inline-block", background: "rgba(52,211,153,0.15)", color: "#34D399", padding: "4px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, marginBottom: "16px", border: "1px solid rgba(52,211,153,0.3)" }}>
                ✓ Verified SmartServ Provider
              </div>
              <h1 style={{ fontSize: "40px", fontWeight: 800, color: "#fff", margin: "0 0 12px", fontFamily: "Playfair Display, serif" }}>
                You're already a provider!
              </h1>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", marginBottom: "32px" }}>
                Manage your services and bookings from your SmartServ dashboard.
              </p>
              <button
                onClick={() => setLocation("/dashboard")}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "12px", fontSize: "16px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}
              >
                Go to Dashboard <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
        <Navbar />
        <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E1B4B 100%)", padding: "80px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ width: "80px", height: "80px", background: "rgba(99,102,241,0.15)", border: "2px solid #818CF8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Zap size={36} color="#A5B4FC" />
            </div>
            <div style={{ display: "inline-block", background: "rgba(99,102,241,0.15)", color: "#A5B4FC", padding: "4px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, marginBottom: "16px", border: "1px solid rgba(99,102,241,0.3)" }}>
              One step left
            </div>
            <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", margin: "0 0 12px", fontFamily: "Playfair Display, serif" }}>
              Activate your subscription to go live
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", margin: "0 auto 32px", maxWidth: "480px" }}>
              Your profile is ready. Subscribe for $2/month to list services and start receiving bookings.
            </p>
            <button
              onClick={() => setLocation("/subscribe")}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "12px", fontSize: "16px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}
            >
              Subscribe Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleOnboard = async () => {
    if (bio.length < 10) { toast.error("Bio must be at least 10 characters"); return; }
    try {
      await onboard.mutateAsync({ bio, phone, location: location2 });
      await utils.auth.me.invalidate();
      toast.success("Profile created! Now activate your subscription.");
      setLocation("/subscribe");
    } catch (e: any) {
      toast.error(e.message || "Failed to register");
    }
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
      <Navbar />

      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E1B4B 100%)", padding: "56px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "5%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(99,102,241,0.2)", color: "#A5B4FC", padding: "6px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, marginBottom: "16px", border: "1px solid rgba(99,102,241,0.3)" }}>
            <Zap size={13} /> Start Earning Today
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: 800, color: "#fff", margin: "0 0 12px", fontFamily: "Playfair Display, serif", lineHeight: 1.15 }}>
            Become a{" "}
            <span style={{ background: "linear-gradient(135deg, #60A5FA, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              SmartServ Provider
            </span>
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", margin: "0 0 32px", maxWidth: "480px", lineHeight: 1.6 }}>
            Join 500+ verified providers earning on their own schedule on SmartServ. Set your rates, choose your jobs.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { icon: DollarSign, text: "Earn on your schedule", color: "#34D399" },
              { icon: Star, text: "Build your reputation", color: "#FBBF24" },
              { icon: Shield, text: "Secure Paynow payments", color: "#60A5FA" },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", padding: "10px 16px", borderRadius: "10px" }}>
                <Icon size={16} color={color} />
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
          {[{ n: 1, label: "Your Profile" }, { n: 2, label: "Subscribe" }].map(({ n, label }, i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", flex: i === 0 ? "none" : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, background: n === 1 ? "linear-gradient(135deg, #3B82F6, #6366F1)" : "#E2E8F0", color: n === 1 ? "#fff" : "#94A3B8", flexShrink: 0 }}>
                  {n}
                </div>
                <span style={{ fontSize: "14px", fontWeight: 600, color: n === 1 ? "#0F172A" : "#94A3B8", whiteSpace: "nowrap" }}>{label}</span>
              </div>
              {i === 0 && <div style={{ flex: 1, height: "2px", background: "#E2E8F0", margin: "0 16px" }} />}
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px", fontFamily: "Playfair Display, serif" }}>
            Tell customers about yourself
          </h2>
          <p style={{ fontSize: "14px", color: "#64748B", margin: "0 0 24px" }}>This will appear on your SmartServ public profile</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Bio <span style={{ color: "#EF4444" }}>*</span></label>
              <textarea
                placeholder="Describe your experience, skills, and what makes you a great service provider..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: "vertical" as const }}
              />
              <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "6px" }}>{bio.length}/1000 characters (minimum 10)</p>
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input type="tel" placeholder="+263 77 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input type="text" placeholder="Harare, Zimbabwe" value={location2} onChange={(e) => setLocation2(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <button
            onClick={handleOnboard}
            disabled={onboard.isPending}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", marginTop: "24px", padding: "16px", border: "none", borderRadius: "12px", background: onboard.isPending ? "#94A3B8" : "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", fontSize: "16px", fontWeight: 700, cursor: onboard.isPending ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }}
          >
            {onboard.isPending ? "Saving..." : <><span>Continue to Subscribe</span><ArrowRight size={18} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
