import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  DollarSign,
  Star,
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  MessageSquare,
  Zap,
} from "lucide-react";
import { getLoginUrl } from "@/const";

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <div style={{ width: "40px", height: "40px", background: "#EEF2FF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} color="#4F46E5" />
        </div>
        <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>{label}</p>
      </div>
      <p style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", margin: 0 }}>{value}</p>
      {sub && <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>{sub}</p>}
    </div>
  );
}

function ReviewModal({ booking, onClose }: { booking: any; onClose: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const createReview = trpc.reviews.create.useMutation();

  const handleSubmit = async () => {
    try {
      await createReview.mutateAsync({ bookingId: booking.id, providerId: booking.providerId, rating, comment });
      toast.success("Review submitted!");
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", maxWidth: "400px", width: "100%" }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>Rate your experience</h3>
        <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "20px" }}>{booking.serviceName} with {booking.providerName}</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setRating(s)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <Star size={32} fill={s <= rating ? "#FBBF24" : "none"} color={s <= rating ? "#FBBF24" : "#CBD5E1"} />
            </button>
          ))}
        </div>
        <Textarea placeholder="Share your experience (optional)" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} style={{ marginBottom: "16px" }} />
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", border: "1px solid #E2E8F0", borderRadius: "10px", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#64748B" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={createReview.isPending} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", cursor: "pointer", fontWeight: 600 }}>
            {createReview.isPending ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddServiceModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("household chores");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("hour");
  const [pricingNotes, setPricingNotes] = useState("");
  const createService = trpc.services.create.useMutation();
  const utils = trpc.useUtils();

  const handleSubmit = async () => {
    if (!name || !price) { toast.error("Name and price required"); return; }
    try {
      await createService.mutateAsync({
        name,
        description: desc,
        category: category as any,
        price: parseFloat(price),
        unit,
        pricingNotes: pricingNotes || undefined,
      });
      await utils.services.list.invalidate();
      toast.success("Service added!");
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", maxWidth: "480px", width: "100%", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A", marginBottom: "20px", fontFamily: "Playfair Display, serif" }}>Add New Service</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Service Name *</label>
            <Input placeholder="e.g. House Cleaning, Solar Installation..." value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", background: "#fff", color: "#0F172A" }}>
              <option value="household chores">🏠 Household Chores</option>
              <option value="repairs">🔧 Repairs</option>
              <option value="personal care">💆 Personal Care</option>
              <option value="skilled trades">⚒️ Skilled Trades</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Description</label>
            <Textarea placeholder="Describe what's included in this service..." value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={{ fontSize: "14px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Price (USD) *</label>
              <Input type="number" placeholder="25" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: "14px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Pricing Unit</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", background: "#fff", color: "#0F172A" }}>
                <option value="hour">per hour</option>
                <option value="job">per job (fixed)</option>
                <option value="day">per day</option>
                <option value="visit">per visit</option>
                <option value="unit">per unit</option>
                <option value="m2">per m²</option>
                <option value="kW">per kW</option>
                <option value="kg">per kg</option>
                <option value="trip">per trip</option>
                <option value="quote">quote/negotiable</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
              Pricing Notes <span style={{ fontWeight: 400, color: "#94A3B8" }}>(optional)</span>
            </label>
            <Input
              placeholder='e.g. "Price includes materials", "Site visit required", "Min. 4 panels"'
              value={pricingNotes}
              onChange={(e) => setPricingNotes(e.target.value)}
            />
            <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>Help customers understand your pricing structure</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", border: "1px solid #E2E8F0", borderRadius: "10px", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#64748B" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={createService.isPending} style={{ flex: 1, padding: "12px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", cursor: "pointer", fontWeight: 600 }}>
            {createService.isPending ? "Adding..." : "Add Service"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth({ redirectOnUnauthenticated: false });
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "services">("overview");
  const [reviewBooking, setReviewBooking] = useState<any>(null);
  const [showAddService, setShowAddService] = useState(false);

  const { data: stats } = trpc.dashboard.stats.useQuery(undefined, { enabled: isAuthenticated });
  const { data: myBookings = [], refetch: refetchBookings } = trpc.bookings.myBookings.useQuery(undefined, {
    enabled: isAuthenticated && !user?.isProvider,
  });
  const { data: providerJobs = [], refetch: refetchJobs } = trpc.bookings.providerJobs.useQuery(undefined, {
    enabled: isAuthenticated && !!user?.isProvider,
  });
  const { data: myServices = [] } = trpc.services.list.useQuery(
    { search: undefined },
    { enabled: isAuthenticated && !!user?.isProvider }
  );
  const { data: subStatus } = trpc.subscription.status.useQuery(undefined, {
    enabled: isAuthenticated && !!user?.isProvider,
  });
  const updateStatus = trpc.bookings.updateStatus.useMutation();
  const deleteService = trpc.services.delete.useMutation();
  const utils = trpc.useUtils();

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
        <Navbar />
        <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E1B4B 100%)", padding: "80px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", marginBottom: "16px", fontFamily: "Playfair Display, serif" }}>Sign in to view your dashboard</h2>
          <button onClick={() => window.location.href = getLoginUrl()} style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "12px", fontSize: "16px", fontWeight: 600, cursor: "pointer" }}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const isProvider = user?.isProvider;
  const hasActiveSubscription = !!(
    subStatus?.status === "active" &&
    subStatus?.expiry &&
    new Date(subStatus.expiry) > new Date()
  );

  const handleAddServiceClick = () => {
    if (!hasActiveSubscription) {
      toast.error("An active subscription is required to add services.");
      setLocation("/subscribe");
      return;
    }
    setShowAddService(true);
  };

  const handleUpdateStatus = async (bookingId: number, status: "confirmed" | "completed" | "cancelled") => {
    try {
      await updateStatus.mutateAsync({ bookingId, status });
      await refetchJobs();
      toast.success(`Booking ${status}`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteService = async (id: number, name: string) => {
    const ok = window.confirm(`Delete "${name}"?\n\nThis will permanently remove the service and cannot be undone.`);
    if (!ok) return;
    try {
      await deleteService.mutateAsync({ id });
      await utils.services.list.invalidate();
      toast.success("Service removed");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const jobs = isProvider ? providerJobs : myBookings;

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
      <Navbar />

      {reviewBooking && <ReviewModal booking={reviewBooking} onClose={() => setReviewBooking(null)} />}
      {showAddService && <AddServiceModal onClose={() => setShowAddService(false)} />}

      {/* Dark Hero Banner */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E1B4B 100%)", padding: "52px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "5%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(99,102,241,0.2)", color: "#A5B4FC", padding: "6px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, marginBottom: "14px", border: "1px solid rgba(99,102,241,0.3)" }}>
              <Zap size={13} /> {isProvider ? "Provider Dashboard" : "Customer Dashboard"}
            </div>
            <h1 style={{ fontSize: "42px", fontWeight: 800, color: "#fff", margin: "0 0 8px", fontFamily: "Playfair Display, serif", lineHeight: 1.15 }}>
              Welcome back,{" "}
              <span style={{ background: "linear-gradient(135deg, #60A5FA, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {user?.name?.split(" ")[0] || "there"}
              </span>
            </h1>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", margin: 0 }}>
              {isProvider ? "Manage your services, bookings and earnings" : "Track your bookings and discover new services"}
            </p>
          </div>
          {isProvider && (
            <button
              onClick={handleAddServiceClick}
              style={{ display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "14px 24px", borderRadius: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.4)", flexShrink: 0 }}
            >
              <Plus size={16} /> Add Service
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Subscription banner */}
        {isProvider && !hasActiveSubscription && (
          <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>⚠️</span>
              <span style={{ fontSize: "14px", color: "#92400E", fontWeight: 500 }}>
                {subStatus?.status === "active"
                  ? "Your subscription has expired. Renew to keep your services listed."
                  : "Subscribe to list services and start receiving bookings."}
              </span>
            </div>
            <button onClick={() => setLocation("/subscribe")} style={{ background: "#F59E0B", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              Subscribe Now
            </button>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <StatCard icon={BookOpen} label="Total Bookings" value={stats?.totalBookings ?? 0} />
          <StatCard icon={DollarSign} label={isProvider ? "Total Earnings" : "Total Spent"} value={`$${stats?.totalEarnings?.toFixed(2) ?? "0.00"}`} />
          {isProvider && <StatCard icon={Star} label="Avg Rating" value={stats?.avgRating ? `${stats.avgRating}/5` : "No reviews"} />}
          <StatCard icon={Clock} label="Pending" value={stats?.pendingJobs ?? 0} sub={isProvider ? "jobs awaiting confirmation" : "bookings pending"} />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", borderBottom: "2px solid #E2E8F0", marginBottom: "24px" }}>
          {(["overview", "bookings", ...(isProvider ? ["services"] : [])] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{ padding: "10px 20px", fontSize: "14px", fontWeight: 600, textTransform: "capitalize", border: "none", background: "none", cursor: "pointer", borderBottom: activeTab === tab ? "2px solid #3B82F6" : "2px solid transparent", color: activeTab === tab ? "#3B82F6" : "#64748B", marginBottom: "-2px", transition: "all 0.2s" }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>Recent Activity</h3>
            {jobs.slice(0, 5).length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "48px", textAlign: "center" }}>
                <Calendar size={40} color="#CBD5E1" style={{ margin: "0 auto 12px" }} />
                <p style={{ color: "#64748B", margin: "0 0 16px" }}>
                  {isProvider ? "No job requests yet. Your services are listed and ready!" : "No bookings yet. Browse services to get started."}
                </p>
                {!isProvider && (
                  <button onClick={() => setLocation("/services")} style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: 600, cursor: "pointer" }}>
                    Browse Services
                  </button>
                )}
              </div>
            ) : (
              jobs.slice(0, 5).map((job: any) => (
                <div key={job.id} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                  <div>
                    <p style={{ fontWeight: 600, color: "#0F172A", margin: "0 0 4px" }}>{job.serviceName}</p>
                    <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
                      {isProvider ? `Customer: ${job.customerName}` : `Provider: ${job.providerName}`}
                      {" · "}{new Date(job.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontWeight: 700, color: "#0F172A" }}>${job.totalPrice}</span>
                    <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, background: job.status === "completed" ? "#D1FAE5" : job.status === "confirmed" ? "#DBEAFE" : job.status === "cancelled" ? "#FEE2E2" : "#FEF3C7", color: job.status === "completed" ? "#065F46" : job.status === "confirmed" ? "#1E40AF" : job.status === "cancelled" ? "#991B1B" : "#92400E" }}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Bookings */}
        {activeTab === "bookings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {jobs.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "48px", textAlign: "center" }}>
                <p style={{ color: "#64748B" }}>No {isProvider ? "job requests" : "bookings"} yet.</p>
              </div>
            ) : (
              jobs.map((job: any) => (
                <div key={job.id} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "20px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, color: "#0F172A", margin: "0 0 4px" }}>{job.serviceName}</p>
                      <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 6px" }}>
                        {isProvider ? `Customer: ${job.customerName}` : `Provider: ${job.providerName}`}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#94A3B8" }}>
                        <Calendar size={12} />
                        {new Date(job.bookingDate).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 700, color: "#3B82F6" }}>${job.totalPrice}</span>
                        <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, background: job.status === "completed" ? "#D1FAE5" : job.status === "confirmed" ? "#DBEAFE" : job.status === "cancelled" ? "#FEE2E2" : "#FEF3C7", color: job.status === "completed" ? "#065F46" : job.status === "confirmed" ? "#1E40AF" : job.status === "cancelled" ? "#991B1B" : "#92400E" }}>
                          {job.status}
                        </span>
                      </div>
                      {isProvider && job.status === "pending" && (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleUpdateStatus(job.id, "confirmed")} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid #BFDBFE", borderRadius: "8px", background: "#EFF6FF", color: "#1D4ED8", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                            <CheckCircle size={13} /> Confirm
                          </button>
                          <button onClick={() => handleUpdateStatus(job.id, "cancelled")} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid #FECACA", borderRadius: "8px", background: "#FEF2F2", color: "#DC2626", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                            <XCircle size={13} /> Decline
                          </button>
                        </div>
                      )}
                      {isProvider && job.status === "confirmed" && (
                        <button onClick={() => handleUpdateStatus(job.id, "completed")} style={{ padding: "6px 12px", border: "none", borderRadius: "8px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                          Mark Complete
                        </button>
                      )}
                      {!isProvider && job.status === "completed" && (
                        <button onClick={() => setReviewBooking(job)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid #E2E8F0", borderRadius: "8px", background: "#fff", color: "#64748B", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                          <MessageSquare size={13} /> Leave Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Services */}
        {activeTab === "services" && isProvider && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>{myServices.filter((s) => s.providerId === user?.id).length} services listed</p>
              <button onClick={handleAddServiceClick} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                <Plus size={14} /> Add Service
              </button>
            </div>
            {myServices.filter((s) => s.providerId === user?.id).length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "48px", textAlign: "center" }}>
                <p style={{ color: "#64748B" }}>No services yet. {hasActiveSubscription ? "Add your first service to start receiving bookings." : "Subscribe to add your first service."}</p>
              </div>
            ) : (
              myServices.filter((s) => s.providerId === user?.id).map((service) => (
                <div key={service.id} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, color: "#0F172A", margin: "0 0 4px" }}>{service.name}</p>
                    <p style={{ fontSize: "13px", color: "#64748B", margin: 0, textTransform: "capitalize" }}>{service.category}</p>
                    {service.description && <p style={{ fontSize: "12px", color: "#94A3B8", margin: "4px 0 0", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{service.description}</p>}
                    {(service as any).pricingNotes && <p style={{ fontSize: "12px", color: "#6366F1", margin: "4px 0 0", fontStyle: "italic" }}>💡 {(service as any).pricingNotes}</p>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 700, color: "#3B82F6", margin: 0 }}>${service.price}</p>
                      <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0 }}>per {service.unit || "job"}</p>
                    </div>
                    <button onClick={() => handleDeleteService(service.id, service.name)} style={{ padding: "8px", border: "1px solid #FECACA", borderRadius: "8px", background: "#FEF2F2", color: "#DC2626", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
