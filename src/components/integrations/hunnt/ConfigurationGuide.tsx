
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ConfigurationGuide = () => {
  return (
    <Card className="bg-dark-700 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white text-lg">Como configurar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-zinc-400">
          <p>1. Acesse sua conta no Hunnt</p>
          <p>2. Vá em Configurações &gt; API &gt; Tokens de Acesso</p>
          <p>3. Crie um novo token de acesso</p>
          <p>4. Copie o ID da sua conta nas configurações do perfil</p>
          <p>5. Cole as informações nos campos acima</p>
        </div>
      </CardContent>
    </Card>
  );
};
