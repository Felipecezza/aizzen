
import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type MenuItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  path?: string;
  isSubmenu?: boolean;
  onClick?: () => void;
};

type SubMenuItem = {
  label: string;
  path: string;
};

interface SidebarMenuProps {
  menuItems: MenuItem[];
  integrationSubmenus: SubMenuItem[];
  agentSubmenus: SubMenuItem[];
  isIntegrationsOpen: boolean;
  isAgentsOpen: boolean;
  setIsIntegrationsOpen: (isOpen: boolean) => void;
  setIsAgentsOpen: (isOpen: boolean) => void;
  isSidebarCollapsed: boolean;
}

export const SidebarMenu = ({
  menuItems,
  integrationSubmenus,
  agentSubmenus,
  isIntegrationsOpen,
  isAgentsOpen,
  setIsIntegrationsOpen,
  setIsAgentsOpen,
  isSidebarCollapsed
}: SidebarMenuProps) => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const handleMenuClick = (item: MenuItem) => {
    if (item.isSubmenu) {
      item.onClick?.();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const getSubmenuItems = (label: string) => {
    if (label === "Integrações") {
      return integrationSubmenus;
    } else if (label === "Agentes") {
      return agentSubmenus;
    }
    return [];
  };

  const isSubmenuOpen = (label: string) => {
    if (label === "Integrações") {
      return isIntegrationsOpen;
    } else if (label === "Agentes") {
      return isAgentsOpen;
    }
    return false;
  };

  return (
    <div className="space-y-3 px-2">
      {menuItems.map(item => (
        <div key={item.label}>
          <div 
            onClick={() => handleMenuClick(item)} 
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-md p-3 text-[#e2e2e2] transition-all duration-200", 
              (currentPath === item.path || 
               (item.label === "Agentes" && (currentPath.startsWith("/agents"))) || 
               (item.label === "Integrações" && currentPath.includes("/integrations"))
              ) ? "bg-dark-700 text-primary" : "hover:bg-dark-700 hover:text-primary"
            )}
          >
            <div className="flex items-center space-x-3">
              <item.icon className={cn("h-5 w-5", 
                (currentPath === item.path || 
                (item.label === "Agentes" && (currentPath.startsWith("/agents"))) || 
                (item.label === "Integrações" && currentPath.includes("/integrations"))
                ) && "text-primary")} />
              {!isSidebarCollapsed && <span className="text-[0.95rem]">{item.label}</span>}
            </div>
            {!isSidebarCollapsed && item.isSubmenu && (
              <ChevronDown className={cn("h-4 w-4 transition-transform", isSubmenuOpen(item.label) && "rotate-180")} />
            )}
          </div>
          
          {!isSidebarCollapsed && item.isSubmenu && isSubmenuOpen(item.label) && (
            <div className="ml-4 space-y-1 mt-1">
              {getSubmenuItems(item.label).map(submenu => (
                <div 
                  key={submenu.label} 
                  onClick={() => navigate(submenu.path)} 
                  className={cn(
                    "cursor-pointer py-2 px-2 text-sm text-zinc-400 hover:text-primary",
                    currentPath === submenu.path && "text-primary"
                  )}
                >
                  {submenu.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
