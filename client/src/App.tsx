import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { getCurrentUser, type UserSession } from "./utils/auth";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import DemoDashboard from "@/pages/demo-dashboard";
import Lookup from "@/pages/lookup";
import Ports from "@/pages/ports";
import Inventory from "@/pages/inventory";
import History from "@/pages/history";
import Domain from "@/pages/domain";
import NetworkMap from "@/pages/network-map";
import PacketCapture from "@/pages/packet-capture";
import Monitoring from "@/pages/monitoring";
import VulnerabilityScan from "@/pages/vulnerability-scan";
import Support from "@/pages/support";
import AuthCallback from "@/pages/auth-callback";
import OAuthCallbackWorking from "@/pages/oauth-callback-working";
import OAuthCallbackFixed from "@/pages/oauth-callback-fixed";
import SignIn from "@/pages/sign-in-working";
import UpgradeSuccess from "@/pages/upgrade-success";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

import NotFound from "@/pages/not-found";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  // Debug routing
  const [location] = useLocation();
  useEffect(() => {
    console.log('%c=== ROUTE CHANGE DETECTED ===', 'color: blue; font-weight: bold');
    console.log('New location:', location);
    console.log('Browser URL:', window.location.href);
  }, [location]);
  
  return (
    <Switch>
      {/* Public pages with PublicLayout */}
      <Route path="/" component={Home} />
      <Route path="/demo" component={DemoDashboard} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/auth/callback/:provider" component={AuthCallback} />
      <Route path="/auth/callback/google" component={OAuthCallbackFixed} />
      <Route path="/auth/callback/github" component={OAuthCallbackWorking} />
      <Route path="/auth/callback/discord" component={OAuthCallbackWorking} />
      
      {/* Admin Console Routes */}
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-Console" component={AdminLogin} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      
      {/* Authenticated pages with AuthenticatedLayout */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/lookup" component={Lookup} />
      <Route path="/ports" component={Ports} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/history" component={History} />
      <Route path="/domain" component={Domain} />
      <Route path="/map" component={NetworkMap} />
      <Route path="/packets" component={PacketCapture} />
      <Route path="/monitoring" component={Monitoring} />
      <Route path="/vuln-scan" component={VulnerabilityScan} />
      <Route path="/support" component={Support} />
      <Route path="/upgrade-success" component={UpgradeSuccess} />
      <Route path="/alerts" component={() => <div>Alerts page coming soon</div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [globalUser, setGlobalUser] = useState<UserSession | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize app: restore user session and setup analytics
  useEffect(() => {
    // Restore user session from localStorage
    const user = getCurrentUser();
    if (user) {
      setGlobalUser(user);
      console.log('Restored user session:', user.name, user.isGuest ? '(Guest)' : '(Authenticated)');
    }

    // Initialize Google Analytics
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }

    setIsInitialized(true);
  }, []);

  // Listen for localStorage changes (e.g., login/logout in other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vnetscan_user') {
        const user = getCurrentUser();
        setGlobalUser(user);
        console.log('User session updated from storage:', user?.name || 'Logged out');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
