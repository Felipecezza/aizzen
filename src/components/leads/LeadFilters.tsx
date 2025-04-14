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
import { Label } from "@/components/ui/label";

// Interface para filtros de leads
export interface LeadFilters {
  dateRange?: DateRange;
  name?: string | null;
  phone?: string | null;
  status?: string | null;
  timeRange?: {
    from: string | null;
    to: string | null;
  };
}

interface LeadFiltersProps {
  onFilterChange: (filters: LeadFilters) => void;
  currentFilters: LeadFilters;
}

export const LeadFilters = ({ onFilterChange, currentFilters }: LeadFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<LeadFilters>(currentFilters);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    currentFilters.dateRange || undefined
  );

  // Status options para o filtro de status
  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "Pendente", label: "Pendente" },
    { value: "Concluído", label: "Concluído" },
    { value: "Silenciado", label: "Silenciado" },
    { value: "Entregue", label: "Entregue" }
  ];

  const handleApplyFilters = () => {
    // Se "all" for selecionado, convertemos para null nos filtros
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
    const emptyFilters: LeadFilters = {};
    setTempFilters(emptyFilters);
    setDateRange(undefined);
    onFilterChange(emptyFilters);
    setIsOpen(false);
  };

  const updateFilter = (key: keyof LeadFilters, value: any) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const updateTimeRange = (type: 'from' | 'to', value: string) => {
    setTempFilters((prev) => ({
      ...prev,
      timeRange: {
        ...prev.timeRange || { from: null, to: null },
        [type]: value || null
      }
    }));
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
          <DialogTitle className="text-white text-xl font-semibold">Filtros de Leads</DialogTitle>
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
                        format(dateRange.from, "dd/MM/yyyy")
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
                        format(dateRange.to, "dd/MM/yyyy")
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

          {/* Nome */}
          <div className="space-y-2">
            <Label className="text-gray-400">Por nome do cliente</Label>
            <Input
              placeholder="Nome do cliente"
              value={tempFilters.name || ""}
              onChange={(e) => updateFilter("name", e.target.value || null)}
              className="border-zinc-800 bg-dark-700 text-gray-300 focus:border-primary/70 focus:ring-primary/20"
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label className="text-gray-400">Por telefone</Label>
            <Input
              placeholder="Número de telefone"
              value={tempFilters.phone || ""}
              onChange={(e) => updateFilter("phone", e.target.value || null)}
              className="border-zinc-800 bg-dark-700 text-gray-300 focus:border-primary/70 focus:ring-primary/20"
            />
          </div>

          {/* Horário início */}
          <div className="space-y-2">
            <Label className="text-gray-400">Hora inicial</Label>
            <Input
              type="time"
              value={tempFilters.timeRange?.from || ""}
              onChange={(e) => updateTimeRange("from", e.target.value)}
              className="border-zinc-800 bg-dark-700 text-gray-300 focus:border-primary/70 focus:ring-primary/20"
            />
          </div>

          {/* Horário fim */}
          <div className="space-y-2">
            <Label className="text-gray-400">Hora final</Label>
            <Input
              type="time"
              value={tempFilters.timeRange?.to || ""}
              onChange={(e) => updateTimeRange("to", e.target.value)}
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
            className="bg-primary hover:bg-primary/90 text-black font-medium"
          >
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 