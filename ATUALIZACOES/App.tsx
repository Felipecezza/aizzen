
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Index from "./pages/Index";
import Orders from "./pages/Orders";
import Agents from "./pages/Agents";
import AgentCatalog from "./pages/agents/AgentCatalog";
import MyAgents from "./pages/agents/MyAgents";
import Analytics from "./pages/Analytics";
import Products from "./pages/Products";
import TiktokIntegration from "./pages/integrations/TiktokIntegration";
import FacebookIntegration from "./pages/integrations/FacebookIntegration";
import LogzzIntegration from "./pages/integrations/LogzzIntegration";
import FacebookCallback from "./pages/integrations/facebook/FacebookCallback";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Account from "./pages/Account";
import Plans from "./pages/Plans";
import Connection from "./pages/Connection";

// Admin pages
import AdminHome from "./pages/admin/AdminHome";
import SuperAdmins from "./pages/admin/SuperAdmins";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import AgentsAdmin from "./pages/admin/AgentsAdmin";
import PlansAdmin from "./pages/admin/PlansAdmin";
import AuthorizedEmails from "./pages/admin/AuthorizedEmails";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Index />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/agents" element={<Navigate to="/agents/catalog" replace />} />
            <Route path="/agents/catalog" element={<AgentCatalog />} />
            <Route path="/agents/my-agents" element={<MyAgents />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/integrations/tiktok" element={<TiktokIntegration />} />
            <Route path="/integrations/facebook" element={<FacebookIntegration />} />
            <Route path="/integrations/logzz" element={<LogzzIntegration />} />
            <Route path="/integrations/facebook/callback" element={<FacebookCallback />} />
            <Route path="/account" element={<Account />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/connection" element={<Connection />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/superadmins" element={<SuperAdmins />} />
            <Route path="/admin/products" element={<ProductsAdmin />} />
            <Route path="/admin/agents" element={<AgentsAdmin />} />
            <Route path="/admin/theme" element={<AdminHome />} />
            <Route path="/admin/plans" element={<PlansAdmin />} />
            <Route path="/admin/emails" element={<AuthorizedEmails />} />
            <Route path="/admin/webhooks" element={<AdminHome />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
