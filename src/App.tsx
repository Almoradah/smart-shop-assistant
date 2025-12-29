import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

// Pages
import LoginPage from "@/features/auth/LoginPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import ProductsPage from "@/features/products/ProductsPage";
import ProductDetailPage from "@/features/products/ProductDetailPage";
import KnowledgePage from "@/features/knowledge/KnowledgePage";
import ConversationsPage from "@/features/conversations/ConversationsPage";
import ConversationDetailPage from "@/features/conversations/ConversationDetailPage";
import AnalyticsPage from "@/features/analytics/AnalyticsPage";
import AISettingsPage from "@/features/ai-settings/AISettingsPage";
import UsersPage from "@/features/users/UsersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
      <Route path="/products/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
      <Route path="/knowledge" element={<ProtectedRoute><KnowledgePage /></ProtectedRoute>} />
      <Route path="/conversations" element={<ProtectedRoute><ConversationsPage /></ProtectedRoute>} />
      <Route path="/conversations/:id" element={<ProtectedRoute><ConversationDetailPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/ai-settings" element={<ProtectedRoute requiredRole="admin"><AISettingsPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute requiredRole="admin"><UsersPage /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
