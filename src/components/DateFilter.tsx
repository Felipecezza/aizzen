
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PALETTE } from "@/styles/colorSystem";

interface DateFilterProps {
  selectedFilter: string;
  onFilterChange: (filter: string, dateRange?: DateRange) => void;
}

export const DateFilter = ({ selectedFilter, onFilterChange }: DateFilterProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const filters = ["Hoje", "Ontem", "7 Dias", "Este mês"];

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      onFilterChange("Customizado", range);
    }
  };

  return (
    <div className="mb-6 flex items-center space-x-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            selectedFilter === filter
              ? "bg-primary text-dark-700"
              : "bg-dark-700 border border-zinc-800 text-gray-300 hover:bg-zinc-800"
          }`}
        >
          {filter}
        </button>
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <button 
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedFilter === "Customizado"
                ? "bg-primary text-dark-700"
                : "bg-dark-700 border border-zinc-800 text-gray-300 hover:bg-zinc-800"
            }`}
          >
            <span>
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yy", { locale: ptBR })} -{" "}
                    {format(dateRange.to, "dd/MM/yy", { locale: ptBR })}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yy", { locale: ptBR })
                )
              ) : (
                "Customizado"
              )}
            </span>
            <CalendarIcon className="h-4 w-4 ml-2" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-dark-700 border border-zinc-800" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateRangeSelect}
            numberOfMonths={2}
            locale={ptBR}
            className="rounded-md bg-dark-700 border-zinc-800"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center text-gray-300",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 text-gray-300 hover:text-primary"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-gray-400 rounded-md w-8 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: cn(
                "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-zinc-800",
                "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              ),
              day: cn(
                "h-8 w-8 p-0 font-normal text-gray-300 hover:bg-zinc-800 hover:text-primary",
              ),
              day_range_start: "day-range-start",
              day_range_end: "day-range-end",
              day_selected:
                "bg-primary text-dark-700 hover:bg-primary hover:text-dark-700 focus:bg-primary focus:text-dark-700",
              day_today: "bg-zinc-800 text-primary",
              day_outside: "text-gray-500 opacity-50",
              day_disabled: "text-gray-500 opacity-50",
              day_range_middle:
                "aria-selected:bg-zinc-800 aria-selected:text-gray-300",
              day_hidden: "invisible",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
