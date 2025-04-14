
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Digite seu email para recuperar a senha");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        toast.error("Erro ao enviar email de recuperação: " + error.message);
        return;
      }
      
      setIsSubmitted(true);
      toast.success("Email de recuperação enviado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao enviar email de recuperação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-stone-950 flex items-center justify-center">
        <div className="flex flex-col md:flex-row w-full h-[600px] md:w-full md:h-screen shadow-lg">
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 md:px-12 lg:px-16">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <img src="https://s3.aizzen.com.br/frontaizzen/logo-aizzen.png" alt="Aizzen Logo" className="h-8 mx-auto mb-8" />
                <h2 className="text-2xl font-bold text-white mb-4">Verifique seu email</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Enviamos um link de recuperação para {email}.<br />
                  Por favor, verifique seu email para redefinir sua senha.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-primary hover:bg-primary-light text-black font-semibold h-12"
                >
                  Tentar novamente
                </Button>
                
                <div className="mt-4">
                  <Link to="/login" className="text-gray-400 hover:text-primary">
                    Voltar para login
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex w-1/2 bg-primary relative">
            <div className="flex flex-col justify-center h-full w-full px-10 lg:px-16">
              <div className="mb-4 mx-[41px]">
                <span className="inline-flex items-center text-black text-base font-normal">
                  <img src="https://s3.aizzen.com.br/frontaizzen/brasilb.png" alt="Bandeira do Brasil" className="h-4 w-6 mr-3" /> 
                  IA DO CASH ON DELIVERY BRASIL
                </span>
              </div>
              <h2 className="text-3xl font-bold text-black mx-[37px]">
                Conversou, convenceu?<br />
                Converteu!
              </h2>
            </div>
          </div>
        </div>

        <div className="fixed inset-0 hidden md:flex items-center justify-center pointer-events-none" style={{
          zIndex: 99999
        }}>
          <img src="https://s3.aizzen.com.br/frontaizzen/lamp.png" alt="Raio" className="h-40" />
        </div>
        
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary py-8 px-4 text-center">
          <div className="flex justify-center mb-1">
            <img src="https://s3.aizzen.com.br/frontaizzen/brasilb.png" alt="Bandeira do Brasil" className="h-4 w-6" /> 
            <span className="ml-2 text-black text-sm font-medium">CASH ON DELIVERY BRASIL</span>
          </div>
          <h2 className="text-2xl font-bold text-black">
            Vendeu, agendou?<br />
            Entregou!
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-stone-950 flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full h-[600px] md:w-full md:h-screen shadow-lg">
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 md:px-12 lg:px-16">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <img src="https://s3.aizzen.com.br/frontaizzen/logo-aizzen.png" alt="Aizzen Logo" className="h-8 mx-auto mb-8" />
              <h2 className="text-2xl font-bold text-white mb-2">Esqueceu sua senha?</h2>
              <p className="text-gray-400 text-sm">Digite seu email abaixo para receber instruções de recuperação</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Seu e-mail cadastrado"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white pl-10 placeholder:text-gray-400"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-light text-black font-semibold h-12"
              >
                {isLoading ? "Enviando..." : "Recuperar senha"}
              </Button>

              <div className="flex justify-between">
                <Link to="/login" className="text-gray-400 hover:text-primary">
                  Voltar para login
                </Link>
                <Link to="/register" className="text-gray-400 hover:text-primary">
                  Criar conta
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 bg-primary relative">
          <div className="flex flex-col justify-center h-full w-full px-10 lg:px-16">
            <div className="mb-4 mx-[41px]">
              <span className="inline-flex items-center text-black text-base font-normal">
                <img src="https://s3.aizzen.com.br/frontaizzen/brasilb.png" alt="Bandeira do Brasil" className="h-4 w-6 mr-3" /> 
                IA DO CASH ON DELIVERY BRASIL
              </span>
            </div>
            <h2 className="text-3xl font-bold text-black mx-[37px]">
              Conversou, convenceu?<br />
              Converteu!
            </h2>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 hidden md:flex items-center justify-center pointer-events-none" style={{
        zIndex: 99999
      }}>
        <img src="https://s3.aizzen.com.br/frontaizzen/lamp.png" alt="Raio" className="h-40" />
      </div>
      
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary py-8 px-4 text-center">
        <div className="flex justify-center mb-1">
          <img src="https://s3.aizzen.com.br/frontaizzen/brasilb.png" alt="Bandeira do Brasil" className="h-4 w-6" /> 
          <span className="ml-2 text-black text-sm font-medium">CASH ON DELIVERY BRASIL</span>
        </div>
        <h2 className="text-2xl font-bold text-black">
          Vendeu, agendou?<br />
          Entregou!
        </h2>
      </div>
    </div>
  );
};

export default ForgotPassword;
