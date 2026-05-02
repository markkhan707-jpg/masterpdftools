import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import MergePdf from "./pages/MergePdf.tsx";
import SplitPdf from "./pages/SplitPdf.tsx";
import CompressPdf from "./pages/CompressPdf.tsx";
import PdfToWord from "./pages/PdfToWord.tsx";
import RotatePdf from "./pages/RotatePdf.tsx";
import UnlockPdf from "./pages/UnlockPdf.tsx";
import ProtectPdf from "./pages/ProtectPdf.tsx";
import PageNumbers from "./pages/PageNumbers.tsx";
import WatermarkPdf from "./pages/WatermarkPdf.tsx";
import JpgToPdf from "./pages/JpgToPdf.tsx";
import PdfToJpg from "./pages/PdfToJpg.tsx";
import DeletePages from "./pages/DeletePages.tsx";
import About from "./pages/About.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/merge-pdf" element={<MergePdf />} />
            <Route path="/split-pdf" element={<SplitPdf />} />
            <Route path="/compress-pdf" element={<CompressPdf />} />
            <Route path="/pdf-to-word" element={<PdfToWord />} />
            <Route path="/rotate-pdf" element={<RotatePdf />} />
            <Route path="/unlock-pdf" element={<UnlockPdf />} />
            <Route path="/protect-pdf" element={<ProtectPdf />} />
            <Route path="/page-numbers" element={<PageNumbers />} />
            <Route path="/watermark-pdf" element={<WatermarkPdf />} />
            <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
            <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
            <Route path="/delete-pages" element={<DeletePages />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
