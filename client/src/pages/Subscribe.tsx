import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { CheckCircle, Zap, Shield, Star, Loader, Copy } from "lucide-react";

export default function Subscribe() {
  const { user, isAuthenticated, loading } = useAuth({ redirectOnUnauthenticated: false });
  const [, setLocation] = useLocation();
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"ecocash" | "innbucks">("ecocash");
  const [pollUrl, setPollUrl] = useState<string | null>(null);
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const initiate = trpc.subscription.initiate.useMutation();
  const poll = trpc.subscription.poll.useMutation();
  const { data: subStatus } = trpc.subscription.status.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!pollUrl || paid) return;
    const interval = setInterval(async () => {
      try {
        const result = await poll.mutateAsync({ pollUrl });
        if (result.paid) {
          setPaid(true);
          clearInterval(interval);
          toast.success("Payment confirmed! Your subscription is active.");
          setTimeout(() => setLocation("/dashboard"), 2000);
        }
      } catch (e) {
        // keep polling
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [pollUrl, paid]);

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
        <Navbar />
        <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E1B4B 100%)", padding: "80px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", marginBottom: "16px", fontFamily: "Playfair Display, serif" }}>Sign in to subscribe</h2>
          <button onClick={() => setLocation("/auth")} style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "12px", fontSize: "16px", fontWeight: 600, cursor: "pointer" }}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (subStatus?.status === "active") {
    const expiry = subStatus.expiry ? new Date(subStatus.expiry).toLocaleDateString() : "N/A";
    return (
      <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
        <Navbar />
        <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E1B4B 100%)", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", background: "rgba(52,211,153,0.15)", border: "2px solid #34D399", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle size={40} color="#34D399" />
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", marginBottom: "12px", fontFamily: "Playfair Display, serif" }}>Subscription Active!</h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", marginBottom: "32px" }}>Your SmartServ subscription renews on {expiry}</p>
          <button onClick={() => setLocation("/dashboard")} style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "12px", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handlePay = async () => {
    if (!phone || phone.length < 9) { toast.error("Please enter a valid phone number"); return; }
    try {
      const result = await initiate.mutateAsync({ phone, method });
      setPollUrl(result.pollUrl);
      setAuthCode((result as any).authCode || null);
      setInstructions((result as any).instructions || null);
      if (method === "ecocash") {
        toast.success("Payment request sent to your EcoCash number. Please approve it on your phone.");
      } else {
        toast.success("Payment created! Follow the InnBucks instructions below.");
      }
    } catch (e: any) {
      toast.error(e.message || "Payment initiation failed");
    }
  };

  const copyCode = () => {
    if (authCode) {
      navigator.clipboard.writeText(authCode);
      toast.success("Code copied!");
    }
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E1B4B 100%)", padding: "56px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(99,102,241,0.2)", color: "#A5B4FC", padding: "6px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, marginBottom: "16px", border: "1px solid rgba(99,102,241,0.3)" }}>
            <Zap size={13} /> SmartServ Provider Subscription
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: 800, color: "#fff", margin: "0 0 12px", fontFamily: "Playfair Display, serif" }}>
            Activate Your SmartServ Account
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", margin: "0 0 32px", lineHeight: 1.6 }}>
            Subscribe for just <strong style={{ color: "#fff" }}>$2/month</strong> to list your services and start receiving bookings on SmartServ.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: CheckCircle, text: "Unlimited service listings", color: "#34D399" },
              { icon: Star, text: "Verified provider badge", color: "#FBBF24" },
              { icon: Shield, text: "Cancel anytime", color: "#60A5FA" },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", padding: "10px 16px", borderRadius: "10px" }}>
                <Icon size={16} color={color} />
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 24px" }}>
        {!pollUrl ? (
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px", fontFamily: "Playfair Display, serif" }}>Pay $2.00</h2>
            <p style={{ fontSize: "14px", color: "#64748B", margin: "0 0 24px" }}>1 month SmartServ provider subscription</p>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "14px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "10px" }}>Payment Method</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {(["ecocash", "innbucks"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    style={{ padding: "14px", border: method === m ? "2px solid #3B82F6" : "2px solid #E2E8F0", borderRadius: "12px", background: method === m ? "#EFF6FF" : "#fff", cursor: "pointer", fontSize: "15px", fontWeight: 700, color: method === m ? "#1D4ED8" : "#64748B", transition: "all 0.2s" }}
                  >
                    {m === "ecocash" ? "📱 EcoCash" : "💳 InnBucks"}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "14px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "8px" }}>
                {method === "ecocash" ? "EcoCash" : "InnBucks"} Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 0771234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: "100%", padding: "14px 16px", border: "2px solid #E2E8F0", borderRadius: "12px", fontSize: "15px", outline: "none", boxSizing: "border-box", fontFamily: "Inter, sans-serif", background: "#FAFAFA", color: "#0F172A" }}
              />
              {method === "innbucks" && (
                <p style={{ fontSize: "12px", color: "#64748B", marginTop: "8px" }}>
                  After clicking Pay, you'll receive a payment code to complete the payment in your InnBucks app.
                </p>
              )}
            </div>

            <button
              onClick={handlePay}
              disabled={initiate.isPending}
              style={{ width: "100%", padding: "16px", border: "none", borderRadius: "12px", background: initiate.isPending ? "#94A3B8" : "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", fontSize: "16px", fontWeight: 700, cursor: initiate.isPending ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }}
            >
              {initiate.isPending ? "Processing..." : "Pay $2.00 via " + (method === "ecocash" ? "EcoCash" : "InnBucks")}
            </button>

            <p style={{ fontSize: "12px", color: "#94A3B8", textAlign: "center", marginTop: "16px" }}>
              🔒 Secured by Paynow Zimbabwe. Cancel anytime.
            </p>
          </div>
        ) : paid ? (
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "40px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <CheckCircle size={56} color="#34D399" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0F172A", marginBottom: "8px", fontFamily: "Playfair Display, serif" }}>Payment Confirmed!</h2>
            <p style={{ color: "#64748B" }}>Redirecting to your SmartServ dashboard...</p>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "40px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Loader size={32} color="#6366F1" style={{ animation: "spin 1s linear infinite" }} />
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", marginBottom: "8px", fontFamily: "Playfair Display, serif" }}>Waiting for Payment</h2>

            {method === "innbucks" && authCode ? (
              <>
                <p style={{ color: "#64748B", marginBottom: "16px" }}>Open your <strong>InnBucks app</strong> and pay with this code:</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "6px", color: "#0F172A", background: "#EEF2FF", padding: "12px 20px", borderRadius: "12px", border: "2px dashed #C7D2FE" }}>
                    {authCode}
                  </span>
                  <button onClick={copyCode} style={{ padding: "10px", border: "1px solid #E2E8F0", borderRadius: "10px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }} aria-label="Copy code">
                    <Copy size={18} color="#64748B" />
                  </button>
                </div>
                <p style={{ fontSize: "13px", color: "#94A3B8" }}>This screen will update automatically once your payment is received.</p>
              </>
            ) : method === "innbucks" && instructions ? (
              <>
                <p style={{ color: "#64748B", marginBottom: "12px" }}>{instructions}</p>
                <p style={{ fontSize: "13px", color: "#94A3B8" }}>This screen will update automatically once your payment is received.</p>
              </>
            ) : (
              <>
                <p style={{ color: "#64748B", marginBottom: "8px" }}>Please approve the payment prompt on your phone.</p>
                <p style={{ fontSize: "13px", color: "#94A3B8" }}>Checking automatically every 5 seconds...</p>
              </>
            )}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
