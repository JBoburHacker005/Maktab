import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Departments from "./pages/Departments";
import News from "./pages/News";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Teachers from "./pages/Teachers";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import NewsAdmin from "./pages/admin/NewsAdmin";
import EventsAdmin from "./pages/admin/EventsAdmin";
import GalleryAdmin from "./pages/admin/GalleryAdmin";
import TeachersAdmin from "./pages/admin/TeachersAdmin";
import DepartmentsAdmin from "./pages/admin/DepartmentsAdmin";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/news" element={<News />} />
              <Route path="/events" element={<Events />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/news" element={<ProtectedRoute><NewsAdmin /></ProtectedRoute>} />
              <Route path="/admin/events" element={<ProtectedRoute><EventsAdmin /></ProtectedRoute>} />
              <Route path="/admin/gallery" element={<ProtectedRoute><GalleryAdmin /></ProtectedRoute>} />
              <Route path="/admin/teachers" element={<ProtectedRoute><TeachersAdmin /></ProtectedRoute>} />
              <Route path="/admin/departments" element={<ProtectedRoute><DepartmentsAdmin /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
