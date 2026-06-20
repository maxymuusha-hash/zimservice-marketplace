import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LayoutDashboard, LogOut, User, Wrench } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <button onClick={() => setLocation("/")} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <span className="text-xl font-bold text-foreground">ZimService</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocation("/services")}
            className="text-sm text-foreground hover:text-accent transition-colors px-3 py-2"
          >
            Browse Services
          </button>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => setLocation("/dashboard")}
                className="flex items-center gap-1 text-sm text-foreground hover:text-accent transition-colors px-3 py-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              {!user?.isProvider && (
                <button
                  onClick={() => setLocation("/provider/onboarding")}
                  className="flex items-center gap-1 text-sm text-foreground hover:text-accent transition-colors px-3 py-2"
                >
                  <Wrench className="w-4 h-4" />
                  <span className="hidden sm:inline">Become Provider</span>
                </button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <Button size="sm" asChild className="btn-primary">
              <a href={getLoginUrl()}>Sign In</a>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
