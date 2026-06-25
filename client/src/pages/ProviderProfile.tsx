import { useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Star, CheckCircle, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

const CATEGORY_STYLE: Record<string, { bg: string; text: string; icon: string }> = {
  "household chores": { bg: "#EFF6FF", text: "#1D4ED8", icon: "🏠" },
  "repairs": { bg: "#FFF7ED", text: "#C2410C", icon: "🔧" },
  "personal care": { bg: "#FDF2F8", text: "#BE185D", icon: "💆" },
  "skilled trades": { bg: "#FFFBEB", text: "#B45309", icon: "⚒️" },
};

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} size={14} fill={i < rating ? "#FBBF24" : "none"} color={i < rating ? "#FBBF24" : "#CBD5E1"} />
      ))}
    </div>
  );
}

function BookingModal({
  service,
  providerId,
  onClose,
}: {
  service: { id: number; name: string; price: number; unit: string | null };
  providerId: number;
  onClose: () => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const createBooking = trpc.bookings.create.useMutation();

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #E2E8F0",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box" as const,
    background: "#fff",
    color: "#0F172A",
    fontFamily: "Inter, sans-serif",
  };

  const handleBook = async () => {
    if (!date || !time) { toast.error("Please select a date and time"); return; }
    try {
      await createBooking.mutateAsync({
        serviceId: service.id,
        providerId,
        bookingDate: new Date(`${date}T${time}`).toISOString(),
      });
      toast.success("Booking request sent! The provider will confirm shortly.");
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Failed to book");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", maxWidth: "440px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", margin: "0 0 4px", fontFamily: "Playfair Display, serif" }}>Book Service</h3>
        <p style={{ fontSize: "14px", color: "#64748B", margin: "0 0 20px" }}>{service.name}</p>

        {/* Price */}
        <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: "12px", padding: "14px 16px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "14px", color: "#64748B" }}>Total Price</span>
          <span style={{ fontSize: "22px", fontWeight: 800, color: "#3B82F6" }}>
            ${service.price}
            <span style={{ fontSize: "13px", fontWeight: 400, color: "#94A3B8" }}>/{service.unit || "job"}</span>
          </span>
        </div>

        {/* Date & Time */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "16px" }}>
          <div>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "8px" }}>📅 Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "8px" }}>🕐 Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <p style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "20px" }}>
          💳 Payment via Paynow will be collected at time of service completion.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", border: "1px solid #E2E8F0", borderRadius: "10px", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#64748B", fontSize: "15px" }}>
            Cancel
          </button>
          <button
            onClick={handleBook}
            disabled={createBooking.isPending}
            style={{ flex: 1, padding: "12px", border: "none", borderRadius: "10px", background: createBooking.isPending ? "#94A3B8" : "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", cursor: createBooking.isPending ? "not-allowed" : "pointer", fontWeight: 700, fontSize: "15px", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}
          >
            {createBooking.isPending ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProviderProfile() {
  const params = useParams();
  const providerId = parseInt(params.id as string);
  const { isAuthenticated } = useAuth();
  const [selectedService, setSelectedService] = useState<null | { id: number; name: string; price: number; unit: string | null }>(null);

  const { data: provider, isLoading } = trpc.provider.get.useQuery({ id: providerId });
  const { data: reviews = [] } = trpc.reviews.forProvider.useQuery({ providerId });

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const handleBook = (service: typeof selectedService) => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    setSelectedService(service);
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
        <Navbar />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ height: "32px", background: "#F1F5F9", borderRadius: "8px", width: "30%", marginBottom: "16px" }} />
          <div style={{ height: "16px", background: "#F1F5F9", borderRadius: "8px", width: "60%" }} />
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#0F172A" }}>Provider not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
      <Navbar />

      {selectedService && (
        <BookingModal service={selectedService} providerId={providerId} onClose={() => setSelectedService(null)} />
      )}

      {/* Dark Hero */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E1B4B 100%)", padding: "48px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "18px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
              {provider.name?.[0]?.toUpperCase() || "P"}
            </div>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(52,211,153,0.15)", color: "#34D399", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, marginBottom: "8px", border: "1px solid rgba(52,211,153,0.3)" }}>
                <CheckCircle size={12} /> Verified Provider
              </div>
              <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", margin: "0 0 6px", fontFamily: "Playfair Display, serif" }}>
                {provider.name || "Service Provider"}
              </h1>
              {reviews.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <StarRating rating={Math.round(avgRating)} />
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
                </div>
              )}
            </div>
          </div>
          {provider.bio && (
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", marginTop: "20px", maxWidth: "600px", lineHeight: 1.7 }}>
              {provider.bio}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>

          {/* Services */}
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A", marginBottom: "16px" }}>Services Offered</h2>
            {provider.services.length === 0 ? (
              <p style={{ color: "#64748B" }}>No services listed yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {provider.services.map((service) => (
                  <div key={service.id} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, background: CATEGORY_STYLE[service.category]?.bg ?? "#F1F5F9", color: CATEGORY_STYLE[service.category]?.text ?? "#64748B", display: "inline-block", marginBottom: "10px" }}>
                          {CATEGORY_STYLE[service.category]?.icon} {service.category}
                        </span>
                        <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>{service.name}</h3>
                        {service.description && <p style={{ fontSize: "14px", color: "#64748B", margin: 0, lineHeight: 1.6 }}>{service.description}</p>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: "22px", fontWeight: 800, color: "#3B82F6", margin: 0 }}>${service.price}</p>
                          <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0 }}>per {service.unit || "job"}</p>
                        </div>
                        <button
                          onClick={() => handleBook({ id: service.id, name: service.name, price: service.price, unit: service.unit })}
                          style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.3)", whiteSpace: "nowrap" }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A", marginBottom: "16px" }}>Reviews</h2>
            {reviews.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px", textAlign: "center" }}>
                <p style={{ fontSize: "24px", marginBottom: "8px" }}>⭐</p>
                <p style={{ color: "#64748B", fontSize: "14px" }}>No reviews yet — be the first!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {reviews.map((review) => (
                  <div key={review.id} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <StarRating rating={review.rating} />
                      <span style={{ fontSize: "13px", color: "#64748B", fontWeight: 500 }}>{review.customerName}</span>
                    </div>
                    {review.comment && <p style={{ fontSize: "14px", color: "#475569", margin: 0, lineHeight: 1.6 }}>{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
