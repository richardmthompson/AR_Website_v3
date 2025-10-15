import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/HomePage";
import EdTechSolutionsPage from "@/pages/EdTechSolutionsPage";
import EdTechSummitPage from "@/pages/EdTechSummitPage";
import SolutionsPage from "@/pages/SolutionsPage";
import UseCasesPage from "@/pages/UseCasesPage";
import DemosPage from "@/pages/DemosPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ConferencePage from "@/pages/ConferencePage";
import TeamPage from "@/pages/TeamPage";
import NotFound from "@/pages/not-found";
import "./i18n/config";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      {/* Specific routes before general - /solutions/edtech before /solutions */}
      <Route path="/solutions/edtech" component={EdTechSolutionsPage} />
      <Route path="/solutions" component={SolutionsPage} />
      <Route path="/use-cases" component={UseCasesPage} />
      <Route path="/demos" component={DemosPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/conference" component={ConferencePage} />
      <Route path="/team" component={TeamPage} />
      <Route path="/edtechsummit" component={EdTechSummitPage} />
      {/* 404 catch-all */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
