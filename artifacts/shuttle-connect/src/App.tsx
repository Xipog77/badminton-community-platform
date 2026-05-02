import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import AiChat from "@/components/ai-chat";

// Pages
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Home from "@/pages/home";
import Matches from "@/pages/matches";
import CreateMatch from "@/pages/create";
import MatchDetails from "@/pages/match-details";
import ConfirmedMatch from "@/pages/confirmed-match";
import Clans from "@/pages/clans";
import ClanDetails from "@/pages/clan-details";
import Marketplace from "@/pages/marketplace";
import ItemDetails from "@/pages/item-details";
import SellItem from "@/pages/sell-item";
import Profile from "@/pages/profile";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user } = useAuth();
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/home" />} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      <Route path="/home">
        <ProtectedRoute component={Home} />
      </Route>
      <Route path="/matches">
        <ProtectedRoute component={Matches} />
      </Route>
      <Route path="/create">
        <ProtectedRoute component={CreateMatch} />
      </Route>
      <Route path="/match/:id">
        <ProtectedRoute component={MatchDetails} />
      </Route>
      <Route path="/confirmed/:id">
        <ProtectedRoute component={ConfirmedMatch} />
      </Route>
      <Route path="/clans">
        <ProtectedRoute component={Clans} />
      </Route>
      <Route path="/clans/:id">
        <ProtectedRoute component={ClanDetails} />
      </Route>
      <Route path="/marketplace">
        <ProtectedRoute component={Marketplace} />
      </Route>
      <Route path="/marketplace/sell">
        <ProtectedRoute component={SellItem} />
      </Route>
      <Route path="/marketplace/:id">
        <ProtectedRoute component={ItemDetails} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
            <AiChat />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
