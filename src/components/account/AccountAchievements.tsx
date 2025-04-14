
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Medal } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Achievement {
  type: 'bronze' | 'silver' | 'gold';
  title: string;
  threshold: number;
  icon: JSX.Element;
  color: string;
}

interface AccountAchievementsProps {
  userId: string;
}

export const AccountAchievements = ({ userId }: AccountAchievementsProps) => {
  const [totalCommission, setTotalCommission] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const achievements: Achievement[] = [
    {
      type: 'bronze',
      title: 'Bronze',
      threshold: 10000,
      icon: <Medal className="h-5 w-5" />,
      color: 'bg-amber-700/20 text-amber-500 border-amber-700/50'
    },
    {
      type: 'silver',
      title: 'Prata',
      threshold: 50000,
      icon: <Award className="h-5 w-5" />,
      color: 'bg-slate-300/20 text-slate-300 border-slate-400/50'
    },
    {
      type: 'gold',
      title: 'Ouro',
      threshold: 100000,
      icon: <Trophy className="h-5 w-5" />,
      color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
    }
  ];

  useEffect(() => {
    if (!userId) return;
    
    const fetchCommissionData = async () => {
      setLoading(true);
      try {
        // Fetch total commission from orders
        const { data: orders, error } = await supabase
          .from('logzz_orders')
          .select('commission')
          .eq('account_id', userId);

        if (error) {
          console.error('Error fetching commission data:', error);
          return;
        }

        // Calculate total commission
        const total = orders?.reduce((sum, order) => sum + (order.commission || 0), 0) || 0;
        setTotalCommission(total);
      } catch (err) {
        console.error('Error in fetching commission:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissionData();
  }, [userId]);

  // Get the highest achieved level
  const getAchievedLevel = () => {
    if (totalCommission >= 100000) return 'gold';
    if (totalCommission >= 50000) return 'silver';
    if (totalCommission >= 10000) return 'bronze';
    return null;
  };

  const achievedLevel = getAchievedLevel();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="rounded-lg bg-dark-700 p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold text-white mb-4">Conquistas</h3>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin h-6 w-6 border-t-2 border-primary border-r-2 rounded-full mx-auto"></div>
          <p className="text-gray-400 mt-2">Carregando conquistas...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">Total em comissões:</span>
            <span className="text-primary font-semibold">{formatCurrency(totalCommission)}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {achievements.map((achievement) => {
              const isAchieved = 
                (achievement.type === 'bronze' && achievedLevel) ||
                (achievement.type === 'silver' && (achievedLevel === 'silver' || achievedLevel === 'gold')) ||
                (achievement.type === 'gold' && achievedLevel === 'gold');
              
              return (
                <div 
                  key={achievement.type}
                  className={`flex flex-col items-center p-3 rounded-lg border ${
                    isAchieved 
                      ? achievement.color 
                      : 'bg-zinc-800/30 text-zinc-500 border-zinc-700'
                  } transition-all`}
                >
                  <div className={`mb-2 ${isAchieved ? '' : 'opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <h4 className="text-sm font-medium">{achievement.title}</h4>
                  <p className="text-xs mt-1">{formatCurrency(achievement.threshold)}</p>
                  
                  {isAchieved && (
                    <Badge variant="outline" className="mt-2 text-xs bg-primary/20 border-primary/50">
                      Conquistado
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
          
          {!achievedLevel && totalCommission > 0 && (
            <div className="text-sm text-gray-400 mt-3">
              <p>Próxima conquista: {formatCurrency(10000 - totalCommission)} para Bronze</p>
            </div>
          )}
          
          {achievedLevel === 'bronze' && (
            <div className="text-sm text-gray-400 mt-3">
              <p>Próxima conquista: {formatCurrency(50000 - totalCommission)} para Prata</p>
            </div>
          )}
          
          {achievedLevel === 'silver' && (
            <div className="text-sm text-gray-400 mt-3">
              <p>Próxima conquista: {formatCurrency(100000 - totalCommission)} para Ouro</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
