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
import JpgToPdf from "@/pages/JpgToPdf";
import PdfToJpg from "@/pages/PdfToJpg";
import PdfToWord from "@/pages/PdfToWord";
import { useEffect } from "react";

// For pages that don't have dedicated components yet, we'll use ConvertPDF or appropriate templates
const RotatePDF = () => <EditPDF />;
const RemovePages = () => <EditPDF />;
const ExtractPages = () => <SplitPDF />;
const ScanToPDF = () => <ConvertPDF />;
const RepairPDF = () => <CompressPDF />;
const OcrPDF = () => <CompressPDF />;
const PdfToExcel = () => <ConvertPDF />;
const PdfToHtml = () => <ConvertPDF />;
const WordToPdf = () => <ConvertPDF />;
const ExcelToPdf = () => <ConvertPDF />;
const HtmlToPdf = () => <ConvertPDF />;
const AddPageNumbers = () => <EditPDF />;
const AddWatermark = () => <EditPDF />;
const UnlockPDF = () => <SecurePDF />;

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        
        {/* Organize Routes */}
        <Route path="/merge" component={MergePDF} />
        <Route path="/split" component={SplitPDF} />
        <Route path="/remove-pages" component={RemovePages} />
        <Route path="/extract-pages" component={ExtractPages} />
        <Route path="/scan-to-pdf" component={ScanToPDF} />
        
        {/* Optimize Routes */}
        <Route path="/compress" component={CompressPDF} />
        <Route path="/repair" component={RepairPDF} />
        <Route path="/ocr" component={OcrPDF} />
        
        {/* Convert Routes */}
        <Route path="/convert" component={ConvertPDF} />
        <Route path="/pdf-to-word" component={PdfToWord} />
        <Route path="/pdf-to-excel" component={PdfToExcel} />
        <Route path="/pdf-to-jpg" component={PdfToJpg} />
        <Route path="/pdf-to-html" component={PdfToHtml} />
        <Route path="/word-to-pdf" component={WordToPdf} />
        <Route path="/excel-to-pdf" component={ExcelToPdf} />
        <Route path="/jpg-to-pdf" component={JpgToPdf} />
        <Route path="/html-to-pdf" component={HtmlToPdf} />
        
        {/* Edit Routes */}
        <Route path="/edit" component={EditPDF} />
        <Route path="/rotate" component={RotatePDF} />
        <Route path="/add-page-numbers" component={AddPageNumbers} />
        <Route path="/add-watermark" component={AddWatermark} />
        
        {/* Security Routes */}
        <Route path="/secure" component={SecurePDF} />
        <Route path="/unlock" component={UnlockPDF} />
        
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  // Initialize theme from theme.json on startup
  useEffect(() => {
    const applyThemeFromJson = () => {
      // Default theme matching theme.json values
      const defaultTheme = {
        variant: 'professional',
        primary: 'hsl(210, 90%, 40%)',
        appearance: 'light',
        radius: 0.75
      };
      
      // Apply the theme settings
      document.documentElement.style.setProperty('--theme-primary', defaultTheme.primary);
      
      if (defaultTheme.appearance === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      
      document.documentElement.style.setProperty('--theme-radius', `${defaultTheme.radius}rem`);
      document.documentElement.style.setProperty('--radius', `${defaultTheme.radius}rem`);
      
      document.documentElement.classList.remove('professional', 'tint', 'vibrant');
      document.documentElement.classList.add(defaultTheme.variant);
      document.documentElement.setAttribute('data-theme-variant', defaultTheme.variant);
      document.documentElement.style.setProperty('--theme-variant', defaultTheme.variant);
      
      console.log('Initial theme applied from theme.json:', defaultTheme);
    };
    
    applyThemeFromJson();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
