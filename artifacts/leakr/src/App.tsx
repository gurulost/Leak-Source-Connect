import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Layout } from "@/components/layout";
import { Home } from "@/pages/home";
import { Dashboard } from "@/pages/dashboard";
import { LeaksList } from "@/pages/leaks";
import { LeakDetail } from "@/pages/leak-detail";
import { SubmitLeak } from "@/pages/submit-leak";
import { JournalistsList } from "@/pages/journalists";
import { JournalistDetail } from "@/pages/journalist-detail";
import { CreateJournalist } from "@/pages/create-journalist";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/leaks" component={LeaksList} />
        <Route path="/leaks/submit" component={SubmitLeak} />
        <Route path="/leaks/:id" component={LeakDetail} />
        <Route path="/journalists" component={JournalistsList} />
        <Route path="/journalists/new" component={CreateJournalist} />
        <Route path="/journalists/:id" component={JournalistDetail} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
