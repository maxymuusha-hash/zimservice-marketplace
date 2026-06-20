import { useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

const CATEGORY_COLORS: Record<string, string> = {
  "household chores": "bg-blue-100 text-blue-700",
  "repairs": "bg-orange-100 text-orange-700",
  "personal care": "bg-pink-100 text-pink-700",
  "skilled trades": "bg-amber-100 text-amber-700",
};

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
        />
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

  const handleBook = async () => {
    if (!date || !time) {
      toast.error("Please select a date and time");
      return;
    }
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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-foreground mb-1">Book Service</h3>
        <p className="text-muted-foreground text-sm mb-4">{service.name}</p>

        <div className="bg-accent/10 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Price</span>
          <span className="text-xl font-bold text-accent">${service.price}<span className="text-sm font-normal text-muted-foreground">/{service.unit || "job"}</span></span>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Time</label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">Payment via Paynow will be collected at time of service completion.</p>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleBook} disabled={createBooking.isPending} className="flex-1 btn-primary">
            {createBooking.isPending ? "Booking..." : "Confirm Booking"}
          </Button>
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
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setSelectedService(service);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold text-foreground">Provider not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {selectedService && (
        <BookingModal
          service={selectedService}
          providerId={providerId}
          onClose={() => setSelectedService(null)}
        />
      )}

      <div className="container py-8 max-w-4xl">
        {/* Provider Header */}
        <div className="card-elegant mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-white text-3xl font-bold shrink-0">
              {provider.name?.[0]?.toUpperCase() || "P"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-1">{provider.name || "Service Provider"}</h1>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={Math.round(avgRating)} />
                  <span className="text-sm text-muted-foreground">{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Verified Provider</span>
              </div>
              {provider.bio && <p className="text-muted-foreground">{provider.bio}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Services Offered</h2>
            {provider.services.length === 0 ? (
              <p className="text-muted-foreground">No services listed yet.</p>
            ) : (
              provider.services.map((service) => (
                <div key={service.id} className="card-elegant flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs ${CATEGORY_COLORS[service.category] || ""}`}>{service.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-foreground">{service.name}</h3>
                    {service.description && <p className="text-sm text-muted-foreground mt-1">{service.description}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xl font-bold text-accent">${service.price}</p>
                      <p className="text-xs text-muted-foreground">per {service.unit || "job"}</p>
                    </div>
                    <Button
                      onClick={() => handleBook({ id: service.id, name: service.name, price: service.price, unit: service.unit })}
                      className="btn-primary"
                      size="sm"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Reviews Sidebar */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-sm">No reviews yet — be the first!</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="card-elegant">
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-muted-foreground">{review.customerName}</span>
                    </div>
                    {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
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
