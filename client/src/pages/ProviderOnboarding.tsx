import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { CheckCircle, Briefcase, DollarSign, Star, Shield } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function ProviderOnboarding() {
  const { user, isAuthenticated, loading } = useAuth({ redirectOnUnauthenticated: false });
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation2] = useState("");

  // Service form
  const [serviceName, setServiceName] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceCategory, setServiceCategory] = useState<string>("household chores");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceUnit, setServiceUnit] = useState("hour");

  const onboard = trpc.provider.onboard.useMutation();
  const createService = trpc.services.create.useMutation();
  const utils = trpc.useUtils();

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">Sign in to become a provider</h2>
          <Button asChild className="btn-primary">
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  if (user?.isProvider) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">You're already a provider!</h2>
          <p className="text-muted-foreground mb-6">Manage your services and bookings from the dashboard.</p>
          <Button onClick={() => setLocation("/dashboard")} className="btn-primary">Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleOnboard = async () => {
    if (bio.length < 10) {
      toast.error("Bio must be at least 10 characters");
      return;
    }
    try {
      await onboard.mutateAsync({ bio, phone, location });
      await utils.auth.me.invalidate();
      setStep(2);
    } catch (e: any) {
      toast.error(e.message || "Failed to register");
    }
  };

  const handleAddService = async () => {
    if (!serviceName || !servicePrice) {
      toast.error("Service name and price are required");
      return;
    }
    try {
      await createService.mutateAsync({
        name: serviceName,
        description: serviceDesc,
        category: serviceCategory as any,
        price: parseFloat(servicePrice),
        unit: serviceUnit,
      });
      toast.success("Service added!");
      setLocation("/dashboard");
    } catch (e: any) {
      toast.error(e.message || "Failed to add service");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 max-w-2xl mx-auto">

        {/* Progress */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-accent text-white" : "bg-muted text-muted-foreground"}`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              <span className={`text-sm ${step >= s ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s === 1 ? "Your Profile" : "Add a Service"}
              </span>
              {s < 2 && <div className={`h-px w-8 ${step > s ? "bg-accent" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: DollarSign, label: "Earn on your schedule" },
                { icon: Star, label: "Build your reputation" },
                { icon: Shield, label: "Secure Paynow payments" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="card-elegant text-center">
                  <Icon className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            <div className="card-elegant">
              <h2 className="text-xl font-bold text-foreground mb-4">Tell customers about yourself</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Bio <span className="text-destructive">*</span></label>
                  <Textarea
                    placeholder="Describe your experience, skills, and what makes you a great service provider..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{bio.length}/1000 characters (minimum 10)</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone Number</label>
                  <Input placeholder="+263 77 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Location</label>
                  <Input placeholder="Harare, Zimbabwe" value={location} onChange={(e) => setLocation2(e.target.value)} />
                </div>
              </div>

              <Button
                onClick={handleOnboard}
                disabled={onboard.isPending}
                className="btn-primary w-full mt-6"
              >
                {onboard.isPending ? "Registering..." : "Continue to Add Services →"}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card-elegant">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Profile created!</h2>
                <p className="text-sm text-muted-foreground">Now add your first service</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Service Name <span className="text-destructive">*</span></label>
                <Input placeholder="e.g. House Cleaning, Plumbing Repairs..." value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Category <span className="text-destructive">*</span></label>
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground"
                >
                  <option value="household chores">Household Chores</option>
                  <option value="repairs">Repairs</option>
                  <option value="personal care">Personal Care</option>
                  <option value="skilled trades">Skilled Trades</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                <Textarea placeholder="Describe what's included in this service..." value={serviceDesc} onChange={(e) => setServiceDesc(e.target.value)} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Price (USD) <span className="text-destructive">*</span></label>
                  <Input type="number" placeholder="25" value={servicePrice} onChange={(e) => setServicePrice(e.target.value)} min="1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Unit</label>
                  <select
                    value={serviceUnit}
                    onChange={(e) => setServiceUnit(e.target.value)}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground"
                  >
                    <option value="hour">per hour</option>
                    <option value="job">per job</option>
                    <option value="day">per day</option>
                    <option value="visit">per visit</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setLocation("/dashboard")} className="flex-1">
                Skip for now
              </Button>
              <Button onClick={handleAddService} disabled={createService.isPending} className="btn-primary flex-1">
                {createService.isPending ? "Adding..." : "Add Service & Go to Dashboard"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
