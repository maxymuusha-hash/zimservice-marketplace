import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ServicesPage from "./pages/Services";
import ProviderProfile from "./pages/ProviderProfile";
import ProviderOnboarding from "./pages/ProviderOnboarding";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Subscribe from "./pages/Subscribe";
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/provider/onboarding" component={ProviderOnboarding} />
      <Route path="/provider/:id" component={ProviderProfile} />
      <Route path="/dashboard" component={Dashboard} />
<Route path="/subscribe" component={Subscribe} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
