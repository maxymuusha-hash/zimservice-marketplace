import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import { useLocation } from "wouter";
import { Search, Briefcase, Home as HomeIcon, Heart, Wrench, ChevronRight } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "household chores", label: "Household Chores", bg: "#3B82F6", light: "#EFF6FF", textColor: "#1D4ED8" },
  { id: "repairs", label: "Repairs", bg: "#F97316", light: "#FFF7ED", textColor: "#C2410C" },
  { id: "personal care", label: "Personal Care", bg: "#EC4899", light: "#FDF2F8", textColor: "#BE185D" },
  { id: "skilled trades", label: "Skilled Trades", bg: "#F59E0B", light: "#FFFBEB", textColor: "#B45309" },
] as const;

const CATEGORY_STYLE: Record<string, { bg: string; text: string }> = {
  "household chores": { bg: "#EFF6FF", text: "#1D4ED8" },
  "repairs": { bg: "#FFF7ED", text: "#C2410C" },
  "personal care": { bg: "#FDF2F8", text: "#BE185D" },
  "skilled trades": { bg: "#FFFBEB", text: "#B45309" },
};

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
      <div style={{ background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 50%, #f5f0ff 100%)", borderBottom: "1px solid #E2E8F0", padding: "48px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-block", background: "#EEF2FF", color: "#4F46E5", padding: "4px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>
            🔍 Browse Services
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: 800, color: "#0F172A", margin: "0 0 8px", fontFamily: "Playfair Display, serif" }}>
            Find Local Services
          </h1>
          <p style={{ fontSize: "16px", color: "#64748B", margin: "0 0 24px" }}>Browse vetted providers near you</p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: "520px" }}>
            <Search size={18} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 16px 12px 44px", border: "1px solid #E2E8F0", borderRadius: "12px", fontSize: "15px", background: "#fff", color: "#0F172A", outline: "none", boxSizing: "border-box", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Category Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                border: category === cat.id ? "none" : "1px solid #E2E8F0",
                background: category === cat.id ? "linear-gradient(135deg, #3B82F6, #6366F1)" : "#fff",
                color: category === cat.id ? "#fff" : "#64748B",
                boxShadow: category === cat.id ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px", animation: "pulse 1.5s infinite" }}>
                <div style={{ height: "16px", background: "#F1F5F9", borderRadius: "6px", width: "75%", marginBottom: "12px" }} />
                <div style={{ height: "12px", background: "#F1F5F9", borderRadius: "6px", width: "50%", marginBottom: "8px" }} />
                <div style={{ height: "12px", background: "#F1F5F9", borderRadius: "6px", width: "100%" }} />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: "64px", height: "64px", background: "#F1F5F9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Search size={28} color="#94A3B8" />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>No services found</h3>
            <p style={{ color: "#64748B" }}>Try adjusting your search or category filter</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "20px" }}>
              {services.length} service{services.length !== 1 ? "s" : ""} found
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setLocation(`/provider/${service.providerId}`)}
                  style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px", textAlign: "left", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#BFDBFE"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                      background: CATEGORY_STYLE[service.category]?.bg ?? "#F1F5F9",
                      color: CATEGORY_STYLE[service.category]?.text ?? "#64748B",
                    }}>
                      {service.category}
                    </span>
                    <span style={{ fontSize: "18px", fontWeight: 800, color: "#3B82F6" }}>
                      ${service.price}
                      <span style={{ fontSize: "12px", fontWeight: 400, color: "#94A3B8" }}>/{service.unit || "job"}</span>
                    </span>
                  </div>

                  {/* Service name */}
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>
                    {service.name}
                  </h3>
                  {service.description && (
                    <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 16px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {service.description}
                    </p>
                  )}

                  {/* Provider row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid #F1F5F9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                        {service.providerName?.[0]?.toUpperCase() || "P"}
                      </div>
                      <span style={{ fontSize: "13px", color: "#64748B", fontWeight: 500 }}>{service.providerName || "Provider"}</span>
                    </div>
                    <ChevronRight size={16} color="#CBD5E1" />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
