import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import MergePDF from "@/pages/MergePDF";
import SplitPDF from "@/pages/SplitPDF";
import CompressPDF from "@/pages/CompressPDF";
import ConvertPDF from "@/pages/ConvertPDF";
import EditPDF from "@/pages/EditPDF";
import SecurePDF from "@/pages/SecurePDF";
import Contact from "@/pages/Contact";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/merge" component={MergePDF} />
        <Route path="/split" component={SplitPDF} />
        <Route path="/compress" component={CompressPDF} />
        <Route path="/convert" component={ConvertPDF} />
        <Route path="/edit" component={EditPDF} />
        <Route path="/secure" component={SecurePDF} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
