import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Search, Star, DollarSign, Briefcase, Home as HomeIcon, Heart, Wrench, ChevronRight } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "household chores", label: "Household Chores", icon: HomeIcon, color: "bg-blue-100 text-blue-700" },
  { id: "repairs", label: "Repairs", icon: Wrench, color: "bg-orange-100 text-orange-700" },
  { id: "personal care", label: "Personal Care", icon: Heart, color: "bg-pink-100 text-pink-700" },
  { id: "skilled trades", label: "Skilled Trades", icon: Briefcase, color: "bg-amber-100 text-amber-700" },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  "household chores": "bg-blue-100 text-blue-700",
  "repairs": "bg-orange-100 text-orange-700",
  "personal care": "bg-pink-100 text-pink-700",
  "skilled trades": "bg-amber-100 text-amber-700",
};

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [, setLocation] = useLocation();

  const { data: services = [], isLoading } = trpc.services.list.useQuery({
    category: category === "all" ? undefined : (category as any),
    search: search || undefined,
  });

  // Group services by provider
  const providerMap = new Map<number, { name: string | null; bio: string | null; services: typeof services }>();
  services.forEach((s) => {
    if (!providerMap.has(s.providerId)) {
      providerMap.set(s.providerId, { name: s.providerName, bio: s.providerBio, services: [] });
    }
    providerMap.get(s.providerId)!.services.push(s);
  });
  const providers = Array.from(providerMap.entries());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-accent/10 to-background border-b border-border py-12">
        <div className="container">
          <h1 className="text-4xl font-bold text-foreground mb-2">Find Local Services</h1>
          <p className="text-muted-foreground mb-6">Browse vetted providers near you</p>

          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                category === cat.id
                  ? "bg-accent text-white border-accent"
                  : "bg-card text-muted-foreground border-border hover:border-accent hover:text-accent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-elegant animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No services found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">{services.length} service{services.length !== 1 ? "s" : ""} found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setLocation(`/provider/${service.providerId}`)}
                  className="card-elegant text-left group hover:shadow-lg hover:border-accent/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`text-xs ${CATEGORY_COLORS[service.category] || ""}`}>
                      {service.category}
                    </Badge>
                    <span className="text-lg font-bold text-accent">
                      ${service.price}<span className="text-xs font-normal text-muted-foreground">/{service.unit || "job"}</span>
                    </span>
                  </div>

                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-xs font-bold text-accent">
                        {service.providerName?.[0]?.toUpperCase() || "P"}
                      </div>
                      <span className="text-sm text-muted-foreground">{service.providerName || "Provider"}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
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
