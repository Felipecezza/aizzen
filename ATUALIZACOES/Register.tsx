
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            full_name: fullName,
            email,
          }
        }
      });

      if (error) {
        if (error.message.includes("not authorized")) {
          toast.error("Por favor, use um email válido para registro.");
        } else if (error.message.includes("already registered")) {
          toast.error("Este email já está registrado. Por favor, faça login.");
          navigate("/login");
        } else if (error.message.includes("Email não autorizado")) {
          toast.error("Este e-mail não está autorizado para criar uma conta. Entre em contato com nosso suporte.");
        } else {
          toast.error("Erro ao criar conta: " + error.message);
        }
        return;
      }

      if (data.user) {
        // Update the profile with full name
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          updated_at: new Date().toISOString()
        });

        // The account_plans record should now be created automatically by the trigger
        // But we'll add a fallback just in case

        try {
          // Check if plan was created by the trigger
          const { data: planData, error: fetchError } = await supabase
            .from('account_plans')
            .select('*')
            .eq('user_id', data.user.id)
            .single();
            
          // If plan doesn't exist, create it manually
          if (fetchError || !planData) {
            console.log("No plan found, creating one manually");
            
            const { error: planError } = await supabase
              .from('account_plans')
              .insert({
                user_id: data.user.id,
                plan_type: 'Free',
                messages_limit: 0,
                cycle_reset_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                current_usage: 0,
                leads_limit: 3000
              });
              
            if (planError) {
              console.error("Error creating user plan:", planError);
              // Continue with registration even if plan creation fails
              // The user can still use the app, and we'll fix their plan later
            }
          }
        } catch (planError) {
          console.error("Exception in plan creation:", planError);
          // Continue with registration even if plan creation fails
        }

        setIsRegistered(true);
        toast.success("Conta criada! Por favor, verifique seu email para confirmar o registro.");
      }
    } catch (error) {
      console.error("Erro:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar conta";
      
      if (errorMessage.includes("Email não autorizado")) {
        toast.error("Este e-mail não está autorizado para criar uma conta. Entre em contato com nosso suporte.");
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-stone-950 flex items-center justify-center">
        <div className="flex flex-col md:flex-row w-full h-[600px] md:w-full md:h-screen shadow-lg">
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 md:px-12 lg:px-16">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <img src="https://s3.aizzen.com.br/frontaizzen/logo-aizzen.png" alt="Aizzen Logo" className="h-8 mx-auto mb-8" />
                <h2 className="text-2xl font-bold text-white mb-4">Verifique seu email</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Enviamos um link de confirmação para {email}.<br />
                  Por favor, verifique seu email para ativar sua conta.
                </p>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full bg-primary hover:bg-primary-light text-black font-semibold h-12"
                >
                  Ir para o login
                </Button>
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
              <h2 className="text-2xl font-bold text-white mb-2">Crie sua conta</h2>
              <p className="text-gray-400 text-sm">Insira seus dados abaixo para criar sua conta!</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="bg-zinc-800 border-zinc-700 text-white pl-10 placeholder:text-gray-400"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-zinc-800 border-zinc-700 text-white pl-10 placeholder:text-gray-400"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-zinc-800 border-zinc-700 text-white pl-10 pr-10 placeholder:text-gray-400"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-light text-black font-semibold h-12"
              >
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>

              <div className="flex justify-center">
                <Link to="/login" className="text-gray-400 hover:text-primary">
                  Já tem uma conta? Faça login
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
export default Register;
