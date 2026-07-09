import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";
import { Search, ChevronRight, Zap, ShieldCheck, Star, MapPin } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "✨ All Services" },
  { id: "household chores", label: "🏠 Household Chores" },
  { id: "repairs", label: "🔧 Repairs" },
  { id: "personal care", label: "💆 Personal Care" },
  { id: "skilled trades", label: "⚒️ Skilled Trades" },
] as const;

const CATEGORY_STYLE: Record<string, { bg: string; text: string; icon: string }> = {
  "household chores": { bg: "#EFF6FF", text: "#1D4ED8", icon: "🏠" },
  "repairs": { bg: "#FFF7ED", text: "#C2410C", icon: "🔧" },
  "personal care": { bg: "#FDF2F8", text: "#BE185D", icon: "💆" },
  "skilled trades": { bg: "#FFFBEB", text: "#B45309", icon: "⚒️" },
};

const TRUST_BADGES = [
  { icon: ShieldCheck, title: "Verified Providers", sub: "Every provider is checked" },
  { icon: Star, title: "Rated & Reviewed", sub: "Real customer ratings" },
  { icon: MapPin, title: "Local to Zimbabwe", sub: "Built for the local market" },
] as const;

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [, setLocation] = useLocation();

  const { data: services = [], isLoading } = trpc.services.list.useQuery({
    category: category === "all" ? undefined : (category as any),
    search: search || undefined,
  });

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
      <Navbar />

      {/* Hero Banner */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E1B4B 100%)", padding: "64px 0 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "10%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(99,102,241,0.2)", color: "#A5B4FC", padding: "6px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, marginBottom: "20px", border: "1px solid rgba(99,102,241,0.3)" }}>
            <Zap size={13} /> Zimbabwe's Service Marketplace
          </div>
          <h1 style={{ fontSize: "52px", fontWeight: 800, color: "#fff", margin: "0 0 16px", fontFamily: "Playfair Display, serif", lineHeight: 1.1 }}>
            Find Trusted Local<br />
            <span style={{ background: "linear-gradient(135deg, #60A5FA, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Services Near You
            </span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", margin: "0 0 36px", maxWidth: "500px", lineHeight: 1.6 }}>
            Browse vetted, background-checked providers for any job — big or small.
          </p>
          <div style={{ position: "relative", maxWidth: "580px" }}>
            <Search size={20} color="#94A3B8" style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              placeholder="Search services, e.g. plumbing, cleaning..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "18px 20px 18px 52px", border: "none", borderRadius: "16px", fontSize: "16px", background: "rgba(255,255,255,0.95)", color: "#0F172A", outline: "none", boxSizing: "border-box", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
            />
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: "28px", marginTop: "40px", flexWrap: "wrap" }}>
            {TRUST_BADGES.map(({ icon: Icon, title, sub }) => (
              <div key={title} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={19} color="#A5B4FC" />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{title}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>

        {/* Category Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", margin: "32px 0 28px", transform: "translateY(-20px)" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                padding: "10px 20px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                border: "none",
                background: category === cat.id ? "linear-gradient(135deg, #3B82F6, #6366F1)" : "#fff",
                color: category === cat.id ? "#fff" : "#475569",
                boxShadow: category === cat.id ? "0 4px 16px rgba(99,102,241,0.4)" : "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginBottom: "48px" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "28px" }}>
                <div style={{ height: "16px", background: "#F1F5F9", borderRadius: "6px", width: "40%", marginBottom: "16px" }} />
                <div style={{ height: "20px", background: "#F1F5F9", borderRadius: "6px", width: "70%", marginBottom: "10px" }} />
                <div style={{ height: "14px", background: "#F1F5F9", borderRadius: "6px", width: "100%", marginBottom: "6px" }} />
                <div style={{ height: "14px", background: "#F1F5F9", borderRadius: "6px", width: "80%" }} />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>No services found</h3>
            <p style={{ color: "#64748B" }}>Try adjusting your search or browse a different category</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "20px", marginTop: "-8px" }}>
              {services.length} service{services.length !== 1 ? "s" : ""} available
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px", marginBottom: "48px" }}>
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setLocation(`/provider/${service.providerId}`)}
                  style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "28px", textAlign: "left", cursor: "pointer", transition: "all 0.25s", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)"; e.currentTarget.style.borderColor = "#C7D2FE"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
                >
                  {/* Top accent */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(135deg, #3B82F6, #6366F1)" }} />

                  {/* Category badge + price */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <span style={{ padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, background: CATEGORY_STYLE[service.category]?.bg ?? "#F1F5F9", color: CATEGORY_STYLE[service.category]?.text ?? "#64748B" }}>
                      {CATEGORY_STYLE[service.category]?.icon} {service.category}
                    </span>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "22px", fontWeight: 800, color: "#3B82F6" }}>${service.price}</span>
                      <span style={{ fontSize: "12px", color: "#94A3B8" }}>/{service.unit || "job"}</span>
                    </div>
                  </div>

                  {/* Service name */}
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", margin: "0 0 8px", lineHeight: 1.3 }}>
                    {service.name}
                  </h3>

                  {/* Description */}
                  {service.description && (
                    <p style={{ fontSize: "14px", color: "#64748B", margin: "0 0 10px", lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {service.description}
                    </p>
                  )}

                  {/* Pricing notes */}
                  {(service as any).pricingNotes && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#EEF2FF", color: "#4F46E5", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 500, marginBottom: "16px" }}>
                      💡 {(service as any).pricingNotes}
                    </div>
                  )}

                  {/* Provider row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid #F1F5F9", marginTop: (service as any).pricingNotes || service.description ? "0" : "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {service.providerName?.[0]?.toUpperCase() || "P"}
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A" }}>{service.providerName || "Provider"}</div>
                        <div style={{ fontSize: "12px", color: "#94A3B8" }}>Verified Provider ✓</div>
                      </div>
                    </div>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ChevronRight size={16} color="#64748B" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
