
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingDown, TrendingUp } from "lucide-react";

interface CampaignTableProps {
  platform: string;
}

export const CampaignTable = ({ platform }: CampaignTableProps) => {
  // Dados mockados para exemplo
  const campaigns = [
    {
      name: "Campanha Produto A",
      status: "Ativa",
      spent: 1250.45,
      results: 145,
      cpa: 8.62,
      roas: 2.4,
      trending: "up",
    },
    {
      name: "Remarketing Geral",
      status: "Ativa",
      spent: 856.32,
      results: 98,
      cpa: 8.74,
      roas: 1.8,
      trending: "down",
    },
    {
      name: "Prospecção",
      status: "Ativa",
      spent: 2150.78,
      results: 234,
      cpa: 9.19,
      roas: 2.1,
      trending: "up",
    },
  ];

  return (
    <Table className="border border-zinc-800 rounded-lg overflow-hidden">
      <TableHeader className="bg-dark-700">
        <TableRow className="border-b border-zinc-800">
          <TableHead>Campanha</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Gasto</TableHead>
          <TableHead>Resultados</TableHead>
          <TableHead>CPA</TableHead>
          <TableHead>ROAS</TableHead>
          <TableHead>Tendência</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-dark-700">
        {campaigns.map((campaign) => (
          <TableRow key={campaign.name} className="border-b border-zinc-800">
            <TableCell className="font-medium text-white">{campaign.name}</TableCell>
            <TableCell>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {campaign.status}
              </span>
            </TableCell>
            <TableCell>R$ {campaign.spent.toFixed(2)}</TableCell>
            <TableCell>{campaign.results}</TableCell>
            <TableCell>R$ {campaign.cpa.toFixed(2)}</TableCell>
            <TableCell>{campaign.roas}x</TableCell>
            <TableCell>
              {campaign.trending === "up" ? (
                <TrendingUp className="h-4 w-4 text-primary" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
