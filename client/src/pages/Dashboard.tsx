import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { toast } from "sonner";
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
} from "lucide-react";
import { getLoginUrl } from "@/const";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) {
  return (
    <div className="card-elegant">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function ReviewModal({ booking, onClose }: { booking: any; onClose: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const createReview = trpc.reviews.create.useMutation();

  const handleSubmit = async () => {
    try {
      await createReview.mutateAsync({
        bookingId: booking.id,
        providerId: booking.providerId,
        rating,
        comment,
      });
      toast.success("Review submitted!");
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-foreground mb-1">Rate your experience</h3>
        <p className="text-sm text-muted-foreground mb-4">{booking.serviceName} with {booking.providerName}</p>

        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setRating(s)}>
              <Star className={`w-8 h-8 transition-colors ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
            </button>
          ))}
        </div>

        <Textarea
          placeholder="Share your experience (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="mb-4"
        />

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSubmit} disabled={createReview.isPending} className="flex-1 btn-primary">
            {createReview.isPending ? "Submitting..." : "Submit Review"}
          </Button>
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
  const createService = trpc.services.create.useMutation();
  const utils = trpc.useUtils();

  const handleSubmit = async () => {
    if (!name || !price) { toast.error("Name and price required"); return; }
    try {
      await createService.mutateAsync({ name, description: desc, category: category as any, price: parseFloat(price), unit });
      await utils.services.list.invalidate();
      toast.success("Service added!");
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-foreground mb-4">Add New Service</h3>
        <div className="space-y-3">
          <Input placeholder="Service name" value={name} onChange={(e) => setName(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground">
            <option value="household chores">Household Chores</option>
            <option value="repairs">Repairs</option>
            <option value="personal care">Personal Care</option>
            <option value="skilled trades">Skilled Trades</option>
          </select>
          <Textarea placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
          <div className="grid grid-cols-2 gap-2">
            <Input type="number" placeholder="Price (USD)" value={price} onChange={(e) => setPrice(e.target.value)} />
            <select value={unit} onChange={(e) => setUnit(e.target.value)} className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground">
              <option value="hour">per hour</option>
              <option value="job">per job</option>
              <option value="day">per day</option>
              <option value="visit">per visit</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSubmit} disabled={createService.isPending} className="flex-1 btn-primary">
            {createService.isPending ? "Adding..." : "Add Service"}
          </Button>
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
  const { data: myServices = [], refetch: refetchServices } = trpc.services.list.useQuery(
    { search: undefined },
    { enabled: isAuthenticated && !!user?.isProvider }
  );
  const updateStatus = trpc.bookings.updateStatus.useMutation();
  const deleteService = trpc.services.delete.useMutation();
  const utils = trpc.useUtils();

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">Sign in to view your dashboard</h2>
          <Button asChild className="btn-primary"><a href={getLoginUrl()}>Sign In</a></Button>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = async (bookingId: number, status: "confirmed" | "completed" | "cancelled") => {
    try {
      await updateStatus.mutateAsync({ bookingId, status });
      await refetchJobs();
      toast.success(`Booking ${status}`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      await deleteService.mutateAsync({ id });
      await utils.services.list.invalidate();
      toast.success("Service removed");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const isProvider = user?.isProvider;
  const jobs = isProvider ? providerJobs : myBookings;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {reviewBooking && <ReviewModal booking={reviewBooking} onClose={() => setReviewBooking(null)} />}
      {showAddService && <AddServiceModal onClose={() => setShowAddService(false)} />}

      <div className="container py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name?.split(" ")[0] || "there"}</h1>
            <p className="text-muted-foreground text-sm">
              {isProvider ? "Provider Dashboard" : "Customer Dashboard"}
            </p>
          </div>
          {isProvider && (
            <Button onClick={() => setShowAddService(true)} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Service
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={BookOpen}
            label="Total Bookings"
            value={stats?.totalBookings ?? 0}
          />
          <StatCard
            icon={DollarSign}
            label={isProvider ? "Total Earnings" : "Total Spent"}
            value={`$${stats?.totalEarnings?.toFixed(2) ?? "0.00"}`}
          />
          {isProvider && (
            <StatCard
              icon={Star}
              label="Avg Rating"
              value={stats?.avgRating ? `${stats.avgRating}/5` : "No reviews"}
            />
          )}
          <StatCard
            icon={Clock}
            label="Pending"
            value={stats?.pendingJobs ?? 0}
            sub={isProvider ? "jobs awaiting confirmation" : "bookings pending"}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-6">
          {(["overview", "bookings", ...(isProvider ? ["services"] : [])] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            {jobs.slice(0, 5).length === 0 ? (
              <div className="card-elegant text-center py-10">
                <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {isProvider ? "No job requests yet. Your services are listed and ready!" : "No bookings yet. Browse services to get started."}
                </p>
                {!isProvider && (
                  <Button onClick={() => setLocation("/services")} className="btn-primary mt-4">Browse Services</Button>
                )}
              </div>
            ) : (
              jobs.slice(0, 5).map((job: any) => (
                <div key={job.id} className="card-elegant flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{job.serviceName}</p>
                    <p className="text-sm text-muted-foreground">
                      {isProvider ? `Customer: ${(job as any).customerName}` : `Provider: ${(job as any).providerName}`}
                      {" · "}{new Date(job.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">${job.totalPrice}</span>
                    <Badge className={`text-xs ${STATUS_COLORS[job.status]}`}>{job.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Bookings / Jobs */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="card-elegant text-center py-10">
                <p className="text-muted-foreground">No {isProvider ? "job requests" : "bookings"} yet.</p>
              </div>
            ) : (
              jobs.map((job: any) => (
                <div key={job.id} className="card-elegant">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{job.serviceName}</p>
                      <p className="text-sm text-muted-foreground">
                        {isProvider ? `Customer: ${(job as any).customerName}` : `Provider: ${(job as any).providerName}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(job.bookingDate).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-accent">${job.totalPrice}</span>
                        <Badge className={`text-xs ${STATUS_COLORS[job.status]}`}>{job.status}</Badge>
                      </div>
                      {isProvider && job.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(job.id, "confirmed")} className="flex items-center gap-1 text-blue-600 border-blue-200">
                            <CheckCircle className="w-3 h-3" /> Confirm
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(job.id, "cancelled")} className="flex items-center gap-1 text-red-600 border-red-200">
                            <XCircle className="w-3 h-3" /> Decline
                          </Button>
                        </div>
                      )}
                      {isProvider && job.status === "confirmed" && (
                        <Button size="sm" onClick={() => handleUpdateStatus(job.id, "completed")} className="btn-primary text-xs">
                          Mark Complete
                        </Button>
                      )}
                      {!isProvider && job.status === "completed" && (
                        <Button size="sm" variant="outline" onClick={() => setReviewBooking(job)} className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Leave Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Services (provider only) */}
        {activeTab === "services" && isProvider && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{myServices.filter((s) => s.providerId === user?.id).length} services listed</p>
              <Button size="sm" onClick={() => setShowAddService(true)} className="btn-primary flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Service
              </Button>
            </div>
            {myServices.filter((s) => s.providerId === user?.id).length === 0 ? (
              <div className="card-elegant text-center py-10">
                <p className="text-muted-foreground">No services yet. Add your first service to start receiving bookings.</p>
              </div>
            ) : (
              myServices.filter((s) => s.providerId === user?.id).map((service) => (
                <div key={service.id} className="card-elegant flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{service.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{service.category}</p>
                    {service.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{service.description}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-accent">${service.price}</p>
                      <p className="text-xs text-muted-foreground">per {service.unit || "job"}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
