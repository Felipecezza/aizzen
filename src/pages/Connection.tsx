import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCcw, Smartphone, QrCode, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { WhatsappConnectionsList } from "@/components/whatsapp/WhatsappConnectionsList";
import { supabase } from "@/lib/supabase";
import { generateUniqueCode, formatInstanceName, formatPhoneNumberForWebhook } from "@/utils/instanceNameUtils";
import { Progress } from "@/components/ui/progress";

const Connection = () => {
  const [instanceName, setInstanceName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullInstanceName, setFullInstanceName] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showConnectionForm, setShowConnectionForm] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string>("pending");
  const [isProcessingResponse, setIsProcessingResponse] = useState(false);
  const [isQrLoading, setIsQrLoading] = useState(false);
  const qrCodeRef = useRef<HTMLImageElement>(null);
  const [refreshListTrigger, setRefreshListTrigger] = useState(0);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      let formattedValue = value;
      if (value.length > 2) {
        formattedValue = value.substring(0, 2) + ' ' + value.substring(2);
      }
      if (value.length > 7) {
        formattedValue = formattedValue.substring(0, 8) + '-' + formattedValue.substring(8);
      }
      setPhoneNumber(formattedValue);
    }
  };

  const safeBase64Encode = data => {
    try {
      const bytes = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        bytes[i] = data.charCodeAt(i) & 0xff;
      }
      let base64 = '';
      const chunkSize = 1024;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        base64 += String.fromCharCode.apply(null, chunk);
      }
      return btoa(base64);
    } catch (e) {
      console.error("Erro na codificação base64:", e);
      return null;
    }
  };

  const checkConnectionStatus = async () => {
    if (!fullInstanceName) return false;
    try {
      console.log("Verificando status da conexão para:", fullInstanceName);
      const response = await fetch('https://webhook.aizzen.com.br/webhook/verifica-conexao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instanceName: fullInstanceName
        })
      });
      if (!response.ok) {
        throw new Error('Falha ao verificar status da conexão');
      }
      const data = await response.json();
      console.log("Resposta da verificação de status:", data);
      if (Array.isArray(data) && data[0]?.instance?.state === "open") {
        console.log("Atualizando status no banco de dados para active");
        const {
          error: updateError
        } = await supabase.from("whatsapp_connections").update({
          status: "active",
          updated_at: new Date().toISOString()
        }).eq("instance_name", fullInstanceName);
        if (updateError) {
          console.error("Erro ao atualizar status da conexão:", updateError);
          throw updateError;
        }
        setConnectionStatus("active");

        toast.success("Conexão estabelecida", {
          description: "Sua instância está conectada com sucesso."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return false;
    }
  };

  const processWebhookResponse = async response => {
    setIsProcessingResponse(true);
    try {
      const pairingCode = response.headers.get('X-Pairing-Code');
      if (pairingCode) {
        console.log("Código de pareamento encontrado no header:", pairingCode);
        setPairingCode(pairingCode);
      }
      console.log("Response headers:", Array.from(response.headers.entries()).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {}));
      const contentType = response.headers.get('content-type');
      console.log("Tipo de conteúdo da resposta:", contentType);
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        console.log("Resposta JSON completa do webhook:", JSON.stringify(responseData, null, 2));
        if (responseData && responseData.qrcode && typeof responseData.qrcode === 'string') {
          console.log('QR Code base64 recebido no JSON');
          setQrCode(responseData.qrcode);
          if (!pairingCode && responseData.pairingCode) {
            console.log("Código de pareamento encontrado no body:", responseData.pairingCode);
            setPairingCode(responseData.pairingCode);
          }
          setTimeLeft(30);
          if (!showConnectionForm) {
            console.log("Mantendo o estado atual do formulário");
          } else {
            setShowConnectionForm(false);
          }
          return true;
        }
      } else if (contentType && contentType.includes('image')) {
        const arrayBuffer = await response.arrayBuffer();
        console.log("Tamanho da imagem recebida:", arrayBuffer.byteLength, "bytes");
        const bytes = new Uint8Array(arrayBuffer);
        const base64String = `data:image/png;base64,${btoa(Array.from(bytes).map(byte => String.fromCharCode(byte)).join(''))}`;
        console.log('QR Code recebido como imagem binária');
        setQrCode(base64String);
        setTimeLeft(30);
        if (!showConnectionForm) {
          console.log("Mantendo o estado atual do formulário");
        } else {
          setShowConnectionForm(false);
        }
        return true;
      } else {
        try {
          console.log("Tentando processar resposta como blob");
          const blob = await response.blob();
          console.log("Tipo do blob:", blob.type, "Tamanho:", blob.size);
          const url = URL.createObjectURL(blob);
          console.log('URL do blob criada:', url);
          setQrCode(url);
          setTimeLeft(30);
          if (!showConnectionForm) {
            console.log("Mantendo o estado atual do formulário");
          } else {
            setShowConnectionForm(false);
          }
          return true;
        } catch (blobError) {
          console.error("Erro ao processar como blob:", blobError);
          try {
            const text = await response.text();
            console.log("Conteúdo da resposta como texto:", text);
          } catch (textError) {
            console.error("Erro ao ler resposta como texto:", textError);
          }
          return false;
        }
      }
      if (pairingCode) {
        setTimeLeft(30);
        if (!showConnectionForm) {
          console.log("Mantendo o estado atual do formulário");
        } else {
          setShowConnectionForm(false);
        }
        return true;
      }
      throw new Error("Resposta não contém QR code ou código de pareamento");
    } catch (error) {
      console.error("Erro ao processar resposta:", error);
      return false;
    } finally {
      setIsProcessingResponse(false);
    }
  };

  const handleGenerateQRCode = async () => {
    if (!instanceName.trim()) {
      toast.error("Nome da instância obrigatório", {
        description: "Por favor, insira um nome para a instância."
      });
      return;
    }
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
      toast.error("Número de telefone inválido", {
        description: "Por favor, insira um número de telefone válido no formato XX XXXXX-XXXX."
      });
      return;
    }
    setIsLoading(true);
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      let uniqueCode;
      let generatedInstanceName = "";
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 10;
      while (!isUnique && attempts < maxAttempts) {
        uniqueCode = generateUniqueCode();
        const fullName = formatInstanceName(instanceName.trim(), uniqueCode);
        const {
          data: existingInstance
        } = await supabase.from("whatsapp_connections").select("id").eq("instance_name", fullName).single();
        if (!existingInstance) {
          isUnique = true;
          generatedInstanceName = fullName;
          setFullInstanceName(fullName);
        } else {
          attempts++;
        }
      }
      if (!isUnique) {
        throw new Error("Não foi possível gerar um código único após várias tentativas");
      }
      const formattedPhoneNumber = formatPhoneNumberForWebhook(phoneNumber);
      const {
        error: dbError
      } = await supabase.from("whatsapp_connections").insert({
        user_id: user.id,
        instance_name: generatedInstanceName,
        status: "pending",
        phone_number: formattedPhoneNumber
      });
      if (dbError) throw dbError;
      
      setRefreshListTrigger(prev => prev + 1);
      
      console.log('Enviando requisição para o webhook...');
      console.log('Número de telefone formatado:', formattedPhoneNumber);
      console.log('Nome da instância:', generatedInstanceName);
      toast.info("Gerando QR Code", {
        description: "Aguarde enquanto conectamos ao servidor..."
      });
      const response = await fetch('https://webhook.aizzen.com.br/webhook/criar-instancia-evolution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instanceName: generatedInstanceName,
          phoneNumber: formattedPhoneNumber
        })
      });
      if (!response.ok) {
        throw new Error(`Falha ao gerar QR Code: ${response.status} ${response.statusText}`);
      }
      const success = await processWebhookResponse(response);
      if (!success) {
        toast.error("Erro ao processar resposta", {
          description: "Falha ao obter o QR Code ou código de pareamento. Tente novamente."
        });
      } else {
        setShowConnectionForm(false);
      }
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
      toast.error("Erro ao gerar QR Code", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshQRCode = async (instanceNameToRefresh = fullInstanceName) => {
    try {
      console.log('Atualizando QR code...', instanceNameToRefresh);
      setIsQrLoading(true);
      const isConnected = await checkConnectionStatus();
      if (isConnected) {
        console.log("Conexão já está ativa, não é necessário atualizar o QR code");
        setIsQrLoading(false);
        return;
      }
      const requestData = {
        instanceName: instanceNameToRefresh
      };
      console.log("Enviando requisição para atualizar QR code:", requestData);
      const response = await fetch('https://webhook.aizzen.com.br/webhook/atualizar-qr-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      console.log("Status da resposta:", response.status, response.statusText);
      console.log("Tipo de conteúdo:", response.headers.get('content-type'));
      if (!response.ok) {
        throw new Error(`Falha ao atualizar QR Code: ${response.status} ${response.statusText}`);
      }
      if (instanceNameToRefresh !== fullInstanceName) {
        setFullInstanceName(instanceNameToRefresh);
        setShowConnectionForm(false);
      }
      const success = await processWebhookResponse(response);
      if (!success) {
        toast.error("Erro ao processar resposta", {
          description: "Falha ao obter o QR Code ou código de pareamento. Tente novamente."
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar QR code:', error);
      const isConnected = await checkConnectionStatus();
      if (!isConnected) {
        toast.error("Erro ao atualizar QR Code", {
          description: error instanceof Error ? error.message : "Tente novamente mais tarde."
        });
      }
    } finally {
      setIsQrLoading(false);
      setIsProcessingResponse(false);
    }
  };

  const handleRegenerateQRCode = async (instanceName: string) => {
    setConnectionStatus("pending");
    try {
      setIsQrLoading(true);
      console.log("Verificando status da conexão antes de regenerar QR code para:", instanceName);
      const response = await fetch('https://webhook.aizzen.com.br/webhook/verifica-conexao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instanceName: instanceName
        })
      });
      if (!response.ok) {
        throw new Error('Falha ao verificar status da conexão');
      }
      const data = await response.json();
      console.log("Resposta da verificação de status:", data);
      if (Array.isArray(data) && data[0]?.instance?.state === "open") {
        toast.success("Conexão já está ativa", {
          description: "Esta instância já está conectada."
        });
        const {
          error: updateError
        } = await supabase.from("whatsapp_connections").update({
          status: "active",
          updated_at: new Date().toISOString()
        }).eq("instance_name", instanceName);
        if (updateError) {
          console.error("Erro ao atualizar status da conexão:", updateError);
        }
        setConnectionStatus("active");
        return;
      }
      refreshQRCode(instanceName);
    } catch (error) {
      console.error("Erro ao verificar status da conexão:", error);
      refreshQRCode(instanceName);
    } finally {
      setIsQrLoading(false);
    }
  };

  const handleDeleteConnection = () => {
    setQrCode(null);
    setPairingCode(null);
    setConnectionStatus("pending");
    setShowConnectionForm(true);
  };

  const handleBackToForm = () => {
    setQrCode(null);
    setPairingCode(null);
    setShowConnectionForm(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (qrCode && timeLeft > 0 && connectionStatus !== "active") {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && qrCode && connectionStatus !== "active") {
      refreshQRCode();
      setTimeLeft(30); // Reset the timer after refreshing
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [qrCode, timeLeft, connectionStatus]);

  useEffect(() => {
    let statusCheckInterval: NodeJS.Timeout;
    if (!showConnectionForm && qrCode && connectionStatus !== "active") {
      // Check every 10 seconds
      statusCheckInterval = setInterval(() => {
        checkConnectionStatus();
      }, 10000);
    }
    return () => {
      if (statusCheckInterval) clearInterval(statusCheckInterval);
    };
  }, [showConnectionForm, qrCode, connectionStatus, fullInstanceName]);

  // Verificação periódica a cada 75 minutos para instâncias ativas
  useEffect(() => {
    let keepAliveInterval: NodeJS.Timeout;
    
    // Função para verificar todas as instâncias ativas do usuário
    const checkActiveInstances = async () => {
      try {
        console.log("Verificando instâncias ativas a cada 75 minutos");
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("Usuário não autenticado");
          return;
        }
        
        // Buscar todas as instâncias ativas do usuário
        const { data: connections, error } = await supabase
          .from("whatsapp_connections")
          .select("instance_name")
          .eq("user_id", user.id)
          .eq("status", "active");
          
        if (error) {
          console.error("Erro ao buscar instâncias ativas:", error);
          return;
        }
        
        // Verificar cada instância ativa
        for (const connection of connections || []) {
          console.log(`Verificando instância: ${connection.instance_name}`);
          
          try {
            const response = await fetch('https://webhook.aizzen.com.br/webhook/verifica-conexao', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                instanceName: connection.instance_name
              })
            });
            
            if (!response.ok) {
              console.error(`Erro ao verificar instância ${connection.instance_name}: ${response.status}`);
              continue;
            }
            
            const data = await response.json();
            
            // Verificar se a instância ainda está conectada
            if (Array.isArray(data) && data[0]?.instance?.state !== "open") {
              console.log(`Instância ${connection.instance_name} não está mais conectada`);
              
              // Atualizar status no banco de dados
              await supabase.from("whatsapp_connections").update({
                status: "disconnected",
                updated_at: new Date().toISOString()
              }).eq("instance_name", connection.instance_name);
              
              // Atualizar a interface se for a instância atual
              if (connection.instance_name === fullInstanceName) {
                setConnectionStatus("pending");
              }
            } else {
              console.log(`Instância ${connection.instance_name} continua conectada`);
            }
          } catch (instanceError) {
            console.error(`Erro ao verificar instância ${connection.instance_name}:`, instanceError);
          }
        }
      } catch (error) {
        console.error("Erro ao executar verificação periódica:", error);
      }
    };
    
    // Iniciar verificação periódica
    // 75 minutos = 4500000 milissegundos
    const KEEPALIVE_INTERVAL = 75 * 60 * 1000;
    
    // Verificação inicial após 1 minuto
    const initialTimeout = setTimeout(() => {
      checkActiveInstances();
      
      // Configurar intervalo regular após a verificação inicial
      keepAliveInterval = setInterval(checkActiveInstances, KEEPALIVE_INTERVAL);
    }, 60 * 1000);
    
    return () => {
      clearTimeout(initialTimeout);
      if (keepAliveInterval) clearInterval(keepAliveInterval);
    };
  }, [fullInstanceName]);

  return <Layout>
      <div className="container mx-auto p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">Conectar WhatsApp</h2>
            <p className="text-muted-foreground mt-2">
              Escaneie o QR Code ou use o código de pareamento para conectar sua conta do WhatsApp no Aizzen.
            </p>
          </div>

          {showConnectionForm ? <Card className="bg-dark-700 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Conectar Nova Instância</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="instanceName" className="text-white">
                    Nome da Instância
                  </Label>
                  <Input id="instanceName" placeholder="Digite o nome da instância" value={instanceName} onChange={e => setInstanceName(e.target.value)} className="border-zinc-700 text-white bg-dark-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-white">
                    Número de Telefone
                  </Label>
                  <div className="flex">
                    <div className="border border-zinc-700 rounded-l-md px-3 flex items-center text-white bg-dark-500">
                      +55
                    </div>
                    <Input id="phoneNumber" placeholder="XX XXXXX-XXXX" value={phoneNumber} onChange={handlePhoneNumberChange} maxLength={13} className="border-zinc-700 text-white rounded-l-none bg-dark-500" />
                  </div>
                </div>

                <Button onClick={handleGenerateQRCode} disabled={isLoading} variant="horizon" className="w-full">
                  {isLoading ? <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando QR Code...
                    </> : "Gerar QR Code"}
                </Button>
              </CardContent>
            </Card> : isProcessingResponse ? <Card className="bg-dark-700 border-zinc-800">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Processando...</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-white text-center">
                  Aguarde enquanto processamos sua solicitação...
                </p>
              </CardContent>
            </Card> : <Card className="bg-dark-700 border-zinc-800">
              <CardHeader className="text-center">
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={handleBackToForm} className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white">
                    Voltar
                  </Button>
                  <CardTitle className="text-white">Conectar WhatsApp</CardTitle>
                  <div className="w-[70px]"></div> {/* Spacer for alignment */}
                </div>
                {connectionStatus === "active" && <div className="mt-4 bg-green-900/20 border border-green-800 text-green-300 p-3 rounded-md text-center">
                    <CheckCircle2 className="h-5 w-5 mx-auto mb-2" />
                    <p>WhatsApp conectado com sucesso!</p>
                  </div>}
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center space-y-6">
                    <h3 className="text-white text-lg font-medium">Escaneie o QR Code</h3>
                    <div className="bg-white p-4 rounded-lg h-64 w-64 flex items-center justify-center">
                      {isQrLoading ? <Loader2 className="h-12 w-12 animate-spin text-primary" /> : qrCode ? <img ref={qrCodeRef} src={qrCode} alt="QR Code" className="max-h-full max-w-full object-contain" onError={e => {
                    console.error('Erro ao carregar imagem do QR code:', e);
                  }} /> : <div className="flex flex-col items-center justify-center text-zinc-400">
                          <QrCode className="h-12 w-12 mb-2" />
                          <p>QR Code será exibido aqui</p>
                        </div>}
                    </div>
                    
                    {pairingCode && <div className="text-center w-full">
                        <p className="text-zinc-400 mb-2">Código de pareamento</p>
                        <div className="bg-zinc-800 py-3 px-6 rounded-md text-center w-full">
                          <p className="text-primary text-2xl font-mono tracking-widest font-bold">
                            {pairingCode.replace(/(.{3})/g, '$1 ').trim()}
                          </p>
                        </div>
                      </div>}
                    
                    <div className="w-full">
                      <Button onClick={() => refreshQRCode()} className="w-full flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white" disabled={isQrLoading || connectionStatus === "active"}>
                        {isQrLoading ? <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Atualizando...
                          </> : <>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Gerar Novamente
                          </>}
                      </Button>
                      
                      {connectionStatus !== "active" && qrCode && <>
                          <Progress value={timeLeft / 30 * 100} className="h-1 mt-2 bg-zinc-800" indicatorColor="bg-primary" />
                          
                          <p className="text-center text-sm text-zinc-400 mt-2 flex items-center justify-center">
                            <Clock className="h-4 w-4 mr-1 text-primary" />
                            <span className="text-zinc-400">Expira em </span>
                            <span className="text-primary font-medium ml-1">{timeLeft}</span>
                            <span className="text-zinc-400 font-medium ml-1">segundos</span>
                          </p>
                        </>}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-white text-lg font-medium">Como conectar</h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black font-medium">
                          1
                        </div>
                        <div>
                          <h4 className="text-primary font-medium">Abra o WhatsApp no seu celular</h4>
                          <p className="text-zinc-400 text-sm font-medium">Certifique-se de que você está usando a versão mais recente do aplicativo.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black font-medium">
                          2
                        </div>
                        <div>
                          <h4 className="text-primary font-medium">Acesse as <span className="text-primary">configurações</span></h4>
                          <p className="text-zinc-400 text-sm font-medium">Toque em <span className="text-zinc-300">Configurações &gt; Dispositivos conectados</span></p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black font-medium">
                          3
                        </div>
                        <div>
                          <h4 className="text-primary font-medium">Escolha um método de conexão</h4>
                          {pairingCode ? <>
                              <div className="text-zinc-400 text-sm font-medium mb-2">
                                <span className="font-bold">Opção 1:</span> Toque em <span className="text-zinc-300">Conectar um dispositivo</span> e escaneie o QR Code
                              </div>
                              <div className="text-zinc-400 text-sm font-medium flex items-start">
                                <span className="font-bold mr-1">OU</span>
                              </div>
                              <div className="text-zinc-400 text-sm font-medium">
                                <span className="font-bold">Opção 2:</span> Toque em <span className="text-zinc-300">Vincular um dispositivo</span> e digite o código de pareamento
                              </div>
                            </> : <p className="text-zinc-400 text-sm font-medium">Toque em <span className="text-zinc-300">Conectar um dispositivo</span> e escaneie o QR Code</p>}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black font-medium">
                          4
                        </div>
                        <div>
                          <h4 className="text-primary font-medium">Aguarde a conexão</h4>
                          <p className="text-zinc-400 text-sm font-medium">Após conectar, aguarde a confirmação da conexão.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>}

          <Card className="bg-dark-700 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Contas Conectadas</CardTitle>
            </CardHeader>
            <CardContent>
              <WhatsappConnectionsList 
                onDeleteConnection={handleDeleteConnection} 
                onRegenerateQRCode={handleRegenerateQRCode}
                triggerRefresh={refreshListTrigger}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>;
};

export default Connection;

