import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Limpar tokens antigos para evitar problemas com refresh tokens inválidos
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-vtcchttcvmaijvjjcxpu-auth-token');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          toast.error("Email não confirmado. Por favor, verifique seu email e clique no link de confirmação.");
        } else {
          toast.error("Erro ao fazer login. Verifique suas credenciais.");
          console.error("Erro de login:", error.message);
        }
      } else {
        toast.success("Login realizado com sucesso!");
        // Redirecionar para a conta (será feito pelo AuthContext)
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro inesperado ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  return <div className="min-h-screen relative overflow-hidden bg-stone-950 flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full h-[600px] md:w-full md:h-screen shadow-lg">
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 md:px-12 lg:px-16">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <img src="https://s3.aizzen.com.br/frontaizzen/logo-aizzen.png" alt="Aizzen Logo" className="h-8 mx-auto mb-8" />
              <h2 className="text-2xl font-bold text-white mb-2">Acesse sua conta</h2>
              <p className="text-gray-400 text-sm">Insira seus dados abaixo para realizar o login!</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input type="email" placeholder="Seu e-mail" value={email} onChange={e => setEmail(e.target.value)} required className="bg-zinc-800 border-zinc-700 text-white pl-10 placeholder:text-gray-400" />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} required className="bg-zinc-800 border-zinc-700 text-white pl-10 pr-10 placeholder:text-gray-400" />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-light text-black font-semibold h-12">
                {isLoading ? "Entrando..." : "Acessar"}
              </Button>

              <div className="flex justify-between text-sm">
                <Link to="/forgot-password" className="text-gray-400 hover:text-primary">
                  Esqueceu sua senha?
                </Link>
                <Link to="/register" className="text-gray-400 hover:text-primary">
                  Cadastre-se
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
    </div>;
};

export default Login;
