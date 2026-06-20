import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Home as HomeIcon, Heart, Wrench, Star } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import Navbar from "@/components/Navbar";

const SERVICE_CATEGORIES = [
  {
    id: "household-chores",
    name: "Household Chores",
    description: "Cleaning, laundry, organizing, and more",
    icon: HomeIcon,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "repairs",
    name: "Repairs",
    description: "Plumbing, electrical, appliance repairs",
    icon: Wrench,
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "personal-care",
    name: "Personal Care",
    description: "Grooming, fitness, wellness services",
    icon: Heart,
    color: "from-pink-500 to-pink-600",
  },
  {
    id: "skilled-trades",
    name: "Skilled Trades",
    description: "Carpentry, painting, construction work",
    icon: Briefcase,
    color: "from-amber-500 to-amber-600",
  },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);

  const handleBrowseServices = () => {
    navigate("/services");
  };

  const handleBecomeProvider = () => {
    if (isAuthenticated) {
      navigate("/provider/onboarding");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                  Trusted Local Services,{" "}
                  <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                    On Demand
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Connect with vetted service providers in your community. From household chores to skilled trades, find the help you need with confidence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleBrowseServices}
                  className="btn-primary gap-2"
                >
                  Browse Services <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleBecomeProvider}
                  className="btn-outline"
                >
                  Become a Provider
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-border">
                <div>
                  <p className="text-2xl font-bold text-foreground">500+</p>
                  <p className="text-muted-foreground">Verified Providers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">2,000+</p>
                  <p className="text-muted-foreground">Happy Customers</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">4.8 Average Rating</p>
                </div>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative h-96 md:h-full min-h-96 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-border flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10" />
              <div className="text-center space-y-4 relative z-10">
                <div className="w-24 h-24 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                  <Briefcase className="w-12 h-12 text-accent" />
                </div>
                <p className="text-muted-foreground">Professional Services</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-20 md:py-32 bg-card border-t border-border">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Featured Service Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our four main service categories and find the perfect provider for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICE_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={handleBrowseServices}
                  className="card-elegant group hover:shadow-elegant-lg cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 text-left">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground text-left">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent, and secure service booking in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Find & Browse",
                description:
                  "Search for services by category, location, and price. Read reviews and check provider ratings.",
              },
              {
                step: "2",
                title: "Book & Schedule",
                description:
                  "Select your preferred provider and book a time that works for you. Confirm details instantly.",
              },
              {
                step: "3",
                title: "Pay & Review",
                description:
                  "Pay securely through Paynow. Rate and review your provider after the service is complete.",
              },
            ].map((item, index) => (
              <div key={index} className="card-elegant text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-accent">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-accent/10 to-accent/5 border-t border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground">
                Whether you're looking for a service or want to offer your skills, join ZimService today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleBrowseServices}
                className="btn-primary gap-2"
              >
                Find Services <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleBecomeProvider}
                className="btn-secondary"
              >
                Start Earning Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">About</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-accent transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-accent transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <span className="font-semibold text-foreground">ZimService</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 ZimService. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
