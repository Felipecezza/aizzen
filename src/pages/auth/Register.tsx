import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Label } from "@/components/ui/label";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [skipEmailVerification, setSkipEmailVerification] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitting(true);

    try {
      // Verificar se o email já está registrado
      const { data: emailExists, error: emailCheckError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false
        }
      });

      if (emailCheckError) {
        if (emailCheckError.message.includes("Email not confirmed")) {
          toast.error("Este email já está registrado, mas não foi confirmado. Verifique sua caixa de entrada.", {
            duration: 5000
          });
          // Prosseguir com o fluxo de registro, como se tivesse sido bem-sucedido
          setIsRegistered(true);
          return;
        }
      }

      // Verificar se o email está na lista de autorizados
      const { data: authorizedEmails, error: authorizedEmailsError } = await supabase
        .from('authorized_emails')
        .select('email')
        .eq('email', email.toLowerCase());

      if (authorizedEmailsError) {
        console.error('Erro ao verificar email autorizado:', authorizedEmailsError);
        setEmailError('Erro ao verificar email. Tente novamente.');
        setSubmitting(false);
        return;
      }

      // Verificar se o email está autorizado
      if (!authorizedEmails || authorizedEmails.length === 0) {
        setEmailError('Este email não está autorizado para registro. Entre em contato com o administrador.');
        setSubmitting(false);
        return;
      }

      // Verificar limite de uso do email
      const { data: existingAccounts, error: existingAccountsError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email.toLowerCase());

      if (existingAccountsError) {
        console.error('Erro ao verificar contas existentes:', existingAccountsError);
        setEmailError('Erro ao verificar email. Tente novamente.');
        setSubmitting(false);
        return;
      }

      // Limite de 3 contas por email autorizado
      if (existingAccounts && existingAccounts.length >= 3) {
        setEmailError('Limite de contas para este email atingido (máximo 3).');
        setSubmitting(false);
        return;
      }

      // First, create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            full_name: fullName,
            name: fullName,
            email,
          }
        }
      });

      if (error) {
        if (error.message.includes("429") || error.message.includes("Too Many Requests") || error.message.includes("over_email_send_rate_limit")) {
          toast.error("Limite de emails atingido. Por favor, tente novamente após alguns minutos.", {
            duration: 5000,
            description: "O serviço está limitando o envio de emails temporariamente."
          });
          // Mesmo com erro, marcar como registrado para exibir a mensagem de verificação
          setIsRegistered(true);
          // Atualizar a mensagem de sucesso para indicar que pode haver atraso
          toast.success("Conta criada! O email de verificação pode demorar alguns minutos para chegar.", {
            duration: 8000
          });
          return;
        } else if (error.message.includes("not authorized")) {
          toast.error("Por favor, use um email válido para registro.");
        } else if (error.message.includes("already registered")) {
          toast.error("Este email já está registrado. Por favor, faça login.");
          navigate("/login");
        } else {
          toast.error("Erro ao criar conta: " + error.message);
        }
        return;
      }

      if (data.user) {
        try {
          // Fazer login imediatamente para poder atualizar o perfil
          console.log("Tentando fazer login após o registro...");
          const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (loginError) {
            console.log("Erro ao login pós-registro:", loginError);
            setIsRegistered(true);
            toast.success("Conta criada! Por favor, verifique seu email para confirmar o registro.");
          } else {
            console.log("Login pós-registro bem sucedido");
            // Verificar se deseja redirecionar para a área principal
            if (skipEmailVerification) {
              toast.success("Conta criada e login realizado com sucesso!");
              navigate("/account"); // Ou qualquer outra página principal
              return;
            } else {
              setIsRegistered(true);
              toast.success("Conta criada! Por favor, verifique seu email para confirmar o registro.");
            }
          }
        } catch (error) {
          console.log("Erro durante o pós-processamento:", error);
          setIsRegistered(true);
          toast.success("Conta criada! Por favor, verifique seu email para confirmar o registro.");
        }
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
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
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={emailError ? "border-red-500" : ""}
                    required
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                  )}
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

              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox" 
                  id="skip-verification"
                  checked={skipEmailVerification}
                  onChange={(e) => setSkipEmailVerification(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-primary"
                />
                <label htmlFor="skip-verification" className="text-sm text-gray-400">
                  Ir direto para o app (pular verificação de email)
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading || submitting}
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
