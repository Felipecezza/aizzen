import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import NewConnection from "./pages/NewConnection";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { AccountProvider } from "./contexts/AccountContext";
import { ChatwootProvider } from './contexts/ChatwootContext';
import { ChatwootWidget } from '@/components/ChatwootWidget';
import { useChatwoot } from '@/contexts/ChatwootContext';
import { useAuth } from '@/contexts/AuthContext';
import { Chat } from '@/pages/Chat';
import { Settings } from '@/pages/Settings';
import { ChatwootAccountManager } from '@/components/ChatwootAccountManager';
import { Loader2 } from "lucide-react";
import ProductLeads from "./pages/ProductLeads";
import { Sidebar } from "./components/sidebar/Sidebar";

// Admin pages
import AdminHome from "./pages/admin/AdminHome";
import SuperAdmins from "./pages/admin/SuperAdmins";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import AgentsAdmin from "./pages/admin/AgentsAdmin";
import PlansAdmin from "./pages/admin/PlansAdmin";
import AuthorizedEmails from "./pages/admin/AuthorizedEmails";

const queryClient = new QueryClient();

// Layout wrapper para páginas protegidas
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
};

const AppContent = () => {
  const { currentAccount } = useChatwoot();
  const { user } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/new-connection" element={<NewConnection />} />
        <Route path="/agents" element={<MyAgents />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chatwoot-settings" element={<ChatwootAccountManager />} />
      </Routes>
      {user && currentAccount && (
        <ChatwootWidget
          accountId={currentAccount.id}
          baseUrl={currentAccount.baseUrl}
          position={currentAccount.position}
          primaryColor={currentAccount.primaryColor}
        />
      )}
      <Toaster />
    </>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AccountProvider>
            <ChatwootProvider>
              <Router>
                <TooltipProvider>
                  <Routes>
                    {/* Rotas públicas */}
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    
                    {/* Nova página de conexão WhatsApp independente */}
                    <Route 
                      path="/whatsapp-connection" 
                      element={
                        <ProtectedRoute>
                          <NewConnection />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Rotas protegidas com layout persistente */}
                    <Route element={<ProtectedLayout />}>
                      <Route path="/" element={<Navigate to="/account" replace />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:productId/leads" element={<ProductLeads />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/whatsapp-connection" element={<Chat />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/agents/catalog" element={<AgentCatalog />} />
                      <Route path="/agents/my-agents" element={<MyAgents />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/plans" element={<Plans />} />
                      <Route path="/connection" element={<Navigate to="/whatsapp-connection" replace />} />
                      
                      {/* Admin routes */}
                      <Route path="/admin" element={<AdminHome />} />
                      <Route path="/admin/superadmins" element={<SuperAdmins />} />
                      <Route path="/admin/products" element={<ProductsAdmin />} />
                      <Route path="/admin/agents" element={<AgentsAdmin />} />
                      <Route path="/admin/theme" element={<AdminHome />} />
                      <Route path="/admin/plans" element={<PlansAdmin />} />
                      <Route path="/admin/emails" element={<AuthorizedEmails />} />
                    </Route>

                    {/* Rota padrão para redirecionar URLs desconhecidos */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>

                  <Toaster />
                  <Sonner />
                </TooltipProvider>
              </Router>
            </ChatwootProvider>
          </AccountProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
