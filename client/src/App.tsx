import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import VibeCreator from "@/pages/VibeCreatorSimple";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import Activity from "@/pages/Activity";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/onboarding" component={Onboarding} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/create" component={VibeCreator} />
          <Route path="/vibe-creator" component={VibeCreator} />
          <Route path="/profile/:userId?" component={Profile} />
          <Route path="/messages" component={Messages} />
          <Route path="/settings" component={Settings} />
          <Route path="/activity" component={Activity} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="bg-dark-bg text-white min-h-screen">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
