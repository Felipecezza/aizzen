import { useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { SidebarMenu } from "./SidebarMenu";
import { LayoutDashboard, Users, Package, ClipboardList, BarChart2, Cable, QrCode, Settings, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

export const Sidebar = ({
  isSidebarCollapsed,
  setIsSidebarCollapsed
}: SidebarProps) => {
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [isAgentsOpen, setIsAgentsOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };
  
  const integrationSubmenus = [{
    label: "TikTok Ads",
    path: "/integrations/tiktok"
  }, {
    label: "Facebook Ads",
    path: "/integrations/facebook"
  }, {
    label: "Logzz",
    path: "/integrations/logzz"
  }];
  
  const agentSubmenus = [{
    label: "Catálogo de Agentes",
    path: "/agents/catalog"
  }, {
    label: "Meus Agentes",
    path: "/agents/my-agents"
  }];
  
  const menuItems = [
    {
      icon: UserCircle,
      label: "Minha Conta",
      active: false,
      path: "/account"
    },
    {
      icon: Users,
      label: "Agentes",
      active: false,
      isSubmenu: true,
      onClick: () => setIsAgentsOpen(!isAgentsOpen)
    }, 
    {
      icon: Package,
      label: "Produtos",
      active: false,
      path: "/products"
    },
    {
      icon: QrCode,
      label: "Conexão",
      active: false,
      path: "/whatsapp-connection"
    }
  ];
  
  return (
    <nav 
      className={`
        fixed top-0 left-0 h-screen bg-dark-800 transition-all duration-300 z-50
        ${isSidebarCollapsed ? 
          'w-20 lg:translate-x-0 translate-x-0' : 
          'w-64 lg:translate-x-0 translate-x-0'
        }
      `}
    >
      <div className="relative flex items-center h-16 px-4">
        <div className="flex items-center">
          {isSidebarCollapsed ? (
            <img 
              src="https://s3.aizzen.com.br/frontaizzen/icon.png" 
              alt="Logo" 
              className="w-8 h-8"
            />
          ) : (
            <img 
              src="https://s3.aizzen.com.br/frontaizzen/logoaizzen.png" 
              alt="Logo" 
              className="h-8 w-auto"
            />
          )}
        </div>
        
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-10 top-4 z-[60] p-2 rounded-lg hover:bg-dark-700 lg:hidden bg-dark-800"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-6 h-6 text-white" />
          ) : (
            <ChevronLeft className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {!isSidebarCollapsed && <div className="px-4 mb-4"></div>}
      
      <SidebarMenu 
        menuItems={menuItems} 
        integrationSubmenus={integrationSubmenus} 
        agentSubmenus={agentSubmenus} 
        isIntegrationsOpen={isIntegrationsOpen}
        isAgentsOpen={isAgentsOpen}
        setIsIntegrationsOpen={setIsIntegrationsOpen}
        setIsAgentsOpen={setIsAgentsOpen}
        isSidebarCollapsed={isSidebarCollapsed} 
      />

      <div className="absolute bottom-4 w-full px-2">
        <div 
          onClick={handleLogout}
          className="flex cursor-pointer items-center space-x-3 rounded-md p-3 text-[#e2e2e2] hover:bg-dark-700 hover:text-primary"
        >
          <LogOut className="h-5 w-5" />
          <span className={isSidebarCollapsed ? "hidden" : "block text-[0.95rem]"}>Sair</span>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none"></div>
    </nav>
  );
};
