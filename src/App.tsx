
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import React from "react";
import Index from "./pages/Index";
import PsychK from "./pages/PsychK";
import BusinessBenefits from "./pages/BusinessBenefits";
import Facilitator from "./pages/Facilitator";
import Sessions from "./pages/Sessions";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminBlogEdit from "./pages/admin/AdminBlogEdit";
import AdminFacilitator from "./pages/admin/AdminFacilitator";
import AuthProvider from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <HelmetProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/psych-k" element={<PsychK />} />
                  <Route path="/business-benefits" element={<BusinessBenefits />} />
                  <Route path="/facilitator" element={<Facilitator />} />
                  <Route path="/sessions" element={<Sessions />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/blogs" element={<ProtectedRoute><AdminBlogs /></ProtectedRoute>} />
                  <Route path="/admin/blogs/new" element={<ProtectedRoute><AdminBlogEdit /></ProtectedRoute>} />
                  <Route path="/admin/blogs/:id" element={<ProtectedRoute><AdminBlogEdit /></ProtectedRoute>} />
                  <Route path="/admin/facilitator" element={<ProtectedRoute><AdminFacilitator /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </HelmetProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
