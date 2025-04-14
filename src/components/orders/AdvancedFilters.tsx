
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon, Filter, X } from "lucide-react";
import { OrderFilters } from "@/hooks/useLogzzOrders";
import { Label } from "@/components/ui/label";

interface AdvancedFiltersProps {
  onFilterChange: (filters: OrderFilters) => void;
  currentFilters: OrderFilters;
}

export const AdvancedFilters = ({ onFilterChange, currentFilters }: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<OrderFilters>(currentFilters);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    currentFilters.dateRange || undefined
  );

  // Status options for the select dropdown
  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "agendado", label: "Agendado" },
    { value: "separado", label: "Separado" },
    { value: "entregue", label: "Entregue" },
    { value: "em trânsito", label: "Em Trânsito" },
    { value: "cancelado", label: "Cancelado" },
    { value: "frustrado", label: "Frustrado" },
    { value: "em rota", label: "Em Rota" },
    { value: "em separação", label: "Em Separação" },
    { value: "reagendado", label: "Reagendado" },
    { value: "a reagendar", label: "A Reagendar" },
    { value: "completo", label: "Completo" },
  ];

  const handleApplyFilters = () => {
    // If "all" is selected for status, convert it to null in the actual filters
    const filtersToApply = {...tempFilters};
    if (filtersToApply.status === "all") {
      filtersToApply.status = null;
    }
    
    onFilterChange({
      ...filtersToApply,
      dateRange,
    });
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const emptyFilters: OrderFilters = {};
    setTempFilters(emptyFilters);
    setDateRange(undefined);
    onFilterChange(emptyFilters);
    setIsOpen(false);
  };

  const updateFilter = (key: keyof OrderFilters, value: any) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-zinc-800 bg-dark-700 text-primary hover:text-primary-light hover:bg-zinc-800/80"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {Object.keys(currentFilters).length > 0 && (
            <div className="ml-2 w-2 h-2 rounded-full bg-primary" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-dark-700 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">Filtros</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-gray-400">Por data</Label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-zinc-800 bg-dark-700 text-gray-300 hover:border-primary/70"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        format(dateRange.from, "dd MMMM, yyyy")
                      ) : (
                        <span>Data inicial</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-dark-700 border-zinc-800">
                    <Calendar
                      mode="single"
                      selected={dateRange?.from}
                      onSelect={(date) =>
                        setDateRange({ from: date || undefined, to: dateRange?.to })
                      }
                      initialFocus
                      className="bg-dark-700 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-zinc-800 bg-dark-700 text-gray-300 hover:border-primary/70"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.to ? (
                        format(dateRange.to, "dd MMMM, yyyy")
                      ) : (
                        <span>Data final</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-dark-700 border-zinc-800">
                    <Calendar
                      mode="single"
                      selected={dateRange?.to}
                      onSelect={(date) =>
                        setDateRange({ from: dateRange?.from, to: date || undefined })
                      }
                      initialFocus
                      className="bg-dark-700 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-gray-400">Por status</Label>
            <Select
              value={tempFilters.status || "all"}
              onValueChange={(value) => updateFilter("status", value)}
            >
              <SelectTrigger className="border-zinc-800 bg-dark-700 text-gray-300 hover:border-primary/70">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="bg-dark-700 border-zinc-800 text-gray-300">
                {statusOptions.map((option) => (
                  <SelectItem key={option.label} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cliente */}
          <div className="space-y-2">
            <Label className="text-gray-400">Por cliente</Label>
            <Input
              placeholder="Nome do Cliente"
              value={tempFilters.client || ""}
              onChange={(e) => updateFilter("client", e.target.value || null)}
              className="border-zinc-800 bg-dark-700 text-gray-300 focus:border-primary/70 focus:ring-primary/20"
            />
          </div>

          {/* Produto */}
          <div className="space-y-2">
            <Label className="text-gray-400">Por produto</Label>
            <Input
              placeholder="Nome do Produto"
              value={tempFilters.product || ""}
              onChange={(e) => updateFilter("product", e.target.value || null)}
              className="border-zinc-800 bg-dark-700 text-gray-300 focus:border-primary/70 focus:ring-primary/20"
            />
          </div>

          {/* Pedido */}
          <div className="space-y-2">
            <Label className="text-gray-400">Por pedido</Label>
            <Input
              placeholder="Número do Pedido"
              value={tempFilters.orderNumber || ""}
              onChange={(e) => updateFilter("orderNumber", e.target.value || null)}
              className="border-zinc-800 bg-dark-700 text-gray-300 focus:border-primary/70 focus:ring-primary/20"
            />
          </div>

          {/* Documento */}
          <div className="space-y-2">
            <Label className="text-gray-400">Por documento</Label>
            <Input
              placeholder="Documento do Cliente"
              value={tempFilters.document || ""}
              onChange={(e) => updateFilter("document", e.target.value || null)}
              className="border-zinc-800 bg-dark-700 text-gray-300 focus:border-primary/70 focus:ring-primary/20"
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <Label className="text-gray-400">Por WhatsApp</Label>
            <Input
              placeholder="Número do Cliente"
              value={tempFilters.phone || ""}
              onChange={(e) => updateFilter("phone", e.target.value || null)}
              className="border-zinc-800 bg-dark-700 text-gray-300 focus:border-primary/70 focus:ring-primary/20"
            />
          </div>

          {/* Afiliado */}
          <div className="space-y-2">
            <Label className="text-gray-400">Por afiliado</Label>
            <Input
              placeholder="Nome do Afiliado"
              value={tempFilters.affiliate || ""}
              onChange={(e) => updateFilter("affiliate", e.target.value || null)}
              className="border-zinc-800 bg-dark-700 text-gray-300 focus:border-primary/70 focus:ring-primary/20"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center gap-2">
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="border-zinc-800 bg-dark-700 text-white hover:bg-zinc-800"
          >
            <X className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
          <Button
            onClick={handleApplyFilters}
            variant="horizon"
            className="text-dark-700"
          >
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
