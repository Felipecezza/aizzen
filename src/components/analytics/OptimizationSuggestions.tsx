
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface OptimizationSuggestionsProps {
  platform: string;
}

export const OptimizationSuggestions = ({ platform }: OptimizationSuggestionsProps) => {
  // Sugestões mockadas para exemplo
  const suggestions = [
    {
      type: "warning",
      message: "O orçamento da campanha 'Vendas Produto X' está sendo sub-utilizado. Considere aumentar o lance para melhorar o alcance.",
    },
    {
      type: "success",
      message: "A segmentação atual está performando bem. Continue monitorando os resultados.",
    },
    {
      type: "warning",
      message: "O CTR está abaixo da média do setor. Teste diferentes variações de criativos para melhorar o engajamento.",
    },
  ];

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className={`flex items-start space-x-3 p-3 rounded-lg ${
            suggestion.type === "warning" ? "bg-warning/10" : "bg-primary/10"
          }`}
        >
          {suggestion.type === "warning" ? (
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
          )}
          <p className="text-sm text-gray-300">{suggestion.message}</p>
        </div>
      ))}
    </div>
  );
};
