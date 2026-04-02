import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import HistoryPage from "./pages/HistoryPage";
import AboutPage from "./pages/About";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import RefundAndCancellationsPage from "./pages/RefundAndCancellations";
import ContactUsPage from "./pages/ContactUs";
import TermsAndConditionsPage from "./pages/TermsAndConditions";
import CookiesPage from "./pages/Cookies";
import BookmarksPage from "./pages/BookmarksPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <ThemeProvider defaultTheme="dark" attribute="class">
          <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/refund-cancellations" element={<RefundAndCancellationsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/terms-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
        </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;