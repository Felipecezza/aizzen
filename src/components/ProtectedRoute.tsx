import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    // Se não estiver carregando e não tiver usuário, redireciona para login
    if (!loading && !user) {
      console.log('Usuário não autenticado, redirecionando para login');
      navigate("/login");
    }
  }, [navigate, user, loading]);

  // Enquanto estiver carregando, mostra o loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-800">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver carregando e tiver usuário, renderiza os filhos
  if (!loading && user) {
    return <>{children}</>;
  }
  
  // Caso contrário, retorna null (será redirecionado pelo useEffect)
  return null;
};

export default ProtectedRoute;