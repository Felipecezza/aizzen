
import { ReactNode } from "react";

const SuperAdminRoute = ({ children }: { children: ReactNode }) => {
  // Simplificado para sempre permitir acesso
  return <>{children}</>;
};

export default SuperAdminRoute;
