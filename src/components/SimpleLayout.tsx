import React from "react";
import { Sidebar } from "./sidebar/Sidebar";

const SimpleLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <div className="fixed left-0 top-0 h-full">
        <Sidebar 
          isSidebarCollapsed={false}
          setIsSidebarCollapsed={() => {}}
        />
      </div>
      <div style={{ marginLeft: "256px", width: "calc(100% - 256px)" }} className="p-6">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SimpleLayout; 