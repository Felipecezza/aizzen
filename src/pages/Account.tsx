import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AccountForm } from "@/components/account/AccountForm";
import AccountUsage from "@/components/account/AccountUsage";
import AccountAddress from "@/components/AccountAddress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AccountAvatar } from "@/components/account/AccountAvatar";
import { testStorageAccess } from "@/lib/storage-setup";
import { AccountAchievements } from "@/components/account/AccountAchievements";

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [storageBucketReady, setStorageBucketReady] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    full_name: "",
    phone: "",
    cpf: "",
    birth_date: "",
    avatar_url: "",
    revenue: 0,
    address: {
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      complement: ""
    }
  });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
    checkStorageAccess();
  }, []);
  
  const checkStorageAccess = async () => {
    try {
      const storageAccessible = await testStorageAccess();
      setStorageBucketReady(storageAccessible);
    } catch (error) {
      console.error("Error checking storage access:", error);
      setStorageBucketReady(false);
    }
  };
  
  const loadUserData = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserData(prev => ({
          ...prev,
          email: user.email || ""
        }));
        const {
          data,
          error
        } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (error) {
          console.error("Error fetching user profile:", error);
          toast.error("Erro ao carregar dados do perfil");
          return;
        }
        if (data) {
          setUserData(prev => ({
            ...prev,
            ...data,
            address: data.address || {
              street: "",
              number: "",
              neighborhood: "",
              city: "",
              state: "",
              complement: ""
            }
          }));
        }
      } else {
        toast.error("Usuário não autenticado");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Erro ao carregar dados do usuário");
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        setLoading(false);
        return;
      }
      const {
        error
      } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: userData.full_name,
        phone: userData.phone,
        cpf: userData.cpf,
        birth_date: userData.birth_date,
        address: userData.address,
        avatar_url: userData.avatar_url,
        updated_at: new Date().toISOString()
      });
      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Erro ao atualizar dados");
      } else {
        toast.success("Dados atualizados com sucesso!");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Erro ao processar solicitação");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Minha Conta</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Coluna da esquerda (60%) - Informações de perfil, uso e endereço */}
        <div className="lg:col-span-3 space-y-6">
          <AccountUsage />
          
          {/* Informações pessoais */}
          <div className="rounded-lg bg-dark-700 p-6 border border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Informações Pessoais</h3>
            </div>
            <AccountForm userData={userData} setUserData={setUserData} loading={loading} setLoading={setLoading} />
          </div>
          
          {/* Endereço */}
          <div className="rounded-lg bg-dark-700 p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-6">Endereço</h3>
            <AccountAddress address={userData.address} onChange={handleAddressChange} />
          </div>

          {/* Botão de salvar alterações */}
          <Button onClick={handleSubmit} disabled={loading} variant="horizon" className="w-full">
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
        
        {/* Coluna da direita (40%) - Foto de perfil e conquistas */}
        <div className="lg:col-span-2 space-y-6">
          <AccountAvatar 
            userData={userData} 
            setUserData={setUserData} 
            storageBucketReady={storageBucketReady} 
          />
          
          {userId && <AccountAchievements userId={userId} />}
        </div>
      </div>
    </div>
  );
};

export default Account;
