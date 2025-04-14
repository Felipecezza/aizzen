
import { Progress } from "@/components/ui/progress";

interface AccountUsageProps {
  plan: {
    name: string;
    messagesPerMonth: number;
    currentUsage: number;
  };
}

const AccountUsage = ({ plan }: AccountUsageProps) => {
  const usagePercentage = (plan.currentUsage / plan.messagesPerMonth) * 100;

  return (
    <div className="rounded-lg bg-dark-700 p-6 space-y-4 border border-zinc-800">
      <h3 className="text-lg font-semibold text-white">Uso da Conta</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white">Plano atual: {plan.name}</span>
          <span className="text-white">
            {plan.currentUsage} de {plan.messagesPerMonth} conversas
          </span>
        </div>
        <Progress 
          value={usagePercentage} 
          className="h-2 bg-zinc-800 [&>div]:bg-primary" 
        />
      </div>

      <p className="text-sm text-zinc-400">
        Seu plano permite {plan.messagesPerMonth} conversas por mês.
        {usagePercentage > 80 && (
          <span className="text-yellow-500 ml-1">
            Você está próximo do limite do seu plano.
          </span>
        )}
      </p>
    </div>
  );
};

export default AccountUsage;
