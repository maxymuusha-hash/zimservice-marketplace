import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowRight, Briefcase, Home as HomeIcon, Heart, Wrench, Star, CheckCircle, Shield, Clock, ShieldCheck, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CATEGORIES = [
  { name: "Household Chores", desc: "Cleaning, laundry, organizing", icon: HomeIcon, bg: "#3B82F6" },
  { name: "Repairs", desc: "Plumbing, electrical, appliances", icon: Wrench, bg: "#F97316" },
  { name: "Personal Care", desc: "Grooming, fitness, wellness", icon: Heart, bg: "#EC4899" },
  { name: "Skilled Trades", desc: "Carpentry, painting, building", icon: Briefcase, bg: "#F59E0B" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, title: "Verified Providers", sub: "Every provider is checked", color: "#10B981" },
  { icon: Star, title: "Rated & Reviewed", sub: "Real customer ratings", color: "#F59E0B" },
  { icon: MapPin, title: "Local to Zimbabwe", sub: "Built for the local market", color: "#3B82F6" },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Navbar />

      <style>{`
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        .hero-title { font-size: 52px; }
        .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .hero-trust { display: flex; flex-direction: column; gap: 16px; }
        .cta-buttons { display: flex; gap: 16px; flex-wrap: wrap; }
        .badges-row { display: flex; gap: 28px; flex-wrap: wrap; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr; gap: 32px; }
          .hero-title { font-size: 32px !important; }
          .hero-trust { display: none; }
          .cat-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .how-grid { grid-template-columns: 1fr; gap: 16px; }
          .badges-row { gap: 16px; }
          .cta-buttons { flex-direction: column; }
          .cta-buttons button { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 50%, #f5f0ff 100%)", padding: "60px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div className="hero-grid">
            <div>
              <div style={{ display: "inline-block", background: "#EEF2FF", color: "#4F46E5", padding: "6px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, marginBottom: "20px" }}>
                🇿🇼 Zimbabwe's Service Marketplace
              </div>
              <h1 className="hero-title" style={{ fontWeight: 800, lineHeight: 1.1, color: "#0F172A", marginBottom: "16px", fontFamily: "Playfair Display, serif" }}>
                Smart Services,{" "}
                <span style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  On Demand
                </span>
              </h1>
              <p style={{ fontSize: "16px", color: "#64748B", lineHeight: 1.7, marginBottom: "28px" }}>
                Connect with vetted service providers in your community. From household chores to skilled trades — find the help you need with confidence.
              </p>
              <div className="cta-buttons" style={{ marginBottom: "32px" }}>
                <button
                  onClick={() => setLocation("/services")}
                  style={{ display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "12px", fontSize: "16px", fontWeight: 600, cursor: "pointer" }}
                >
                  Browse Services <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => isAuthenticated ? setLocation("/provider/onboarding") : (window.location.href = getLoginUrl())}
                  style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", color: "#3B82F6", border: "2px solid #3B82F6", padding: "14px 28px", borderRadius: "12px", fontSize: "16px", fontWeight: 600, cursor: "pointer" }}
                >
                  Become a Provider
                </button>
              </div>
              <div className="badges-row">
                {TRUST_BADGES.map(({ icon: Icon, title, sub, color }) => (
                  <div key={title} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={18} color={color} />
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", lineHeight: 1.3 }}>{title}</div>
                      <div style={{ fontSize: "12px", color: "#64748B" }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-trust" style={{ background: "linear-gradient(135deg, #EEF2FF, #F0F9FF)", borderRadius: "24px", padding: "40px" }}>
              {[
                { icon: CheckCircle, text: "Verified & background-checked providers", color: "#10B981" },
                { icon: Shield, text: "Secure Paynow payment processing", color: "#3B82F6" },
                { icon: Clock, text: "Book anytime, service on your schedule", color: "#F59E0B" },
                { icon: Star, text: "Rated & reviewed by real customers", color: "#EC4899" },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px", background: "#fff", padding: "16px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <Icon size={20} color={color} />
                  <span style={{ fontSize: "14px", color: "#334155", fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ background: "#F8FAFC", padding: "60px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#0F172A", marginBottom: "10px", fontFamily: "Playfair Display, serif" }}>Featured Service Categories</h2>
            <p style={{ fontSize: "16px", color: "#64748B" }}>Find the perfect provider for any need</p>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map(({ name, desc, icon: Icon, bg }) => (
              <button
                key={name}
                onClick={() => setLocation("/services")}
                style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px 20px", textAlign: "left", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
              >
                <div style={{ width: "48px", height: "48px", background: bg, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                  <Icon size={24} color="#fff" />
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>{name}</div>
                <div style={{ fontSize: "13px", color: "#64748B" }}>{desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "#fff", padding: "60px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#0F172A", marginBottom: "10px", fontFamily: "Playfair Display, serif" }}>How It Works</h2>
            <p style={{ fontSize: "16px", color: "#64748B" }}>Book a service in 3 simple steps</p>
          </div>
          <div className="how-grid">
            {[
              { step: "1", title: "Find & Browse", desc: "Search by category, location, and price. Read reviews and ratings.", color: "#3B82F6" },
              { step: "2", title: "Book & Schedule", desc: "Pick your provider and choose a time that works for you.", color: "#6366F1" },
              { step: "3", title: "Pay & Review", desc: "Pay securely via Paynow and leave a review after the job.", color: "#8B5CF6" },
            ].map(({ step, title, desc, color }) => (
              <div key={step} style={{ textAlign: "center", padding: "28px 24px", background: "#F8FAFC", borderRadius: "16px" }}>
                <div style={{ width: "56px", height: "56px", background: color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "22px", fontWeight: 800, color: "#fff" }}>{step}</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>{title}</div>
                <div style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", padding: "60px 0" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", marginBottom: "12px", fontFamily: "Playfair Display, serif" }}>Ready to Get Started?</h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", marginBottom: "28px" }}>Join Zimbabweans using SmartServ to get things done.</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setLocation("/services")} style={{ background: "#fff", color: "#3B82F6", border: "none", padding: "14px 28px", borderRadius: "12px", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}>
              Find Services
            </button>
            <button onClick={() => isAuthenticated ? setLocation("/provider/onboarding") : (window.location.href = getLoginUrl())} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "2px solid rgba(255,255,255,0.5)", padding: "14px 28px", borderRadius: "12px", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}>
              List Your Services
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
