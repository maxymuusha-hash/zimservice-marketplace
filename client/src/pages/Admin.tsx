import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Briefcase, CreditCard, TrendingUp, Zap } from "lucide-react";

function AdminStatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <div style={{ width: "40px", height: "40px", background: "#EEF2FF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} color="#4F46E5" />
        </div>
        <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>{label}</p>
      </div>
      <p style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", margin: 0 }}>{value}</p>
    </div>
  );
}

export default function Admin() {
  const { data: stats, error: statsError } = trpc.admin.stats.useQuery();
  const { data: recentUsers = [] } = trpc.admin.recentUsers.useQuery();

  if (statsError) {
    return (
      <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
        <Navbar />
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0F172A", fontFamily: "Playfair Display, serif" }}>Not authorized</h2>
          <p style={{ color: "#64748B" }}>This page is restricted to the SmartServ administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E1B4B 100%)", padding: "40px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(99,102,241,0.2)", color: "#A5B4FC", padding: "6px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, marginBottom: "12px", border: "1px solid rgba(99,102,241,0.3)" }}>
            <Zap size={13} /> Admin
          </div>
          <h1 style={{ fontSize: "34px", fontWeight: 800, color: "#fff", margin: 0, fontFamily: "Playfair Display, serif" }}>
            Platform Overview
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <AdminStatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? "…"} />
          <AdminStatCard icon={Briefcase} label="Providers" value={stats?.totalProviders ?? "…"} />
          <AdminStatCard icon={CreditCard} label="Active Subscriptions" value={stats?.activeSubscriptions ?? "…"} />
          <AdminStatCard icon={TrendingUp} label="New This Week" value={stats?.newThisWeek ?? "…"} />
        </div>

        {/* Recent signups */}
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "12px" }}>Recent Sign-ups</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "48px" }}>
          {recentUsers.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "32px", textAlign: "center", color: "#64748B" }}>
              No users yet.
            </div>
          ) : (
            recentUsers.map((u: any) => (
              <div key={u.id} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                    {u.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A" }}>{u.name || "Unnamed"}</div>
                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>{u.email}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {u.isProvider && (
                    <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, background: "#DBEAFE", color: "#1E40AF" }}>Provider</span>
                  )}
                  {u.subscriptionStatus === "active" && (
                    <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, background: "#D1FAE5", color: "#065F46" }}>Subscribed</span>
                  )}
                  <span style={{ fontSize: "12px", color: "#94A3B8" }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
