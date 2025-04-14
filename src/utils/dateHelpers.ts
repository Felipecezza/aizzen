import { addDays, startOfDay, endOfDay, subDays, subMonths, subYears, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";

export const formatDateToDisplay = (date: Date): string => {
  return format(date, "dd/MM", { locale: ptBR });
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  return date >= start && date <= end;
};

export const getDateRangeForFilter = (filter: string, range?: DateRange) => {
  const today = new Date();
  const endDate = range?.to || today;
  let startDate = range?.from || today;

  switch (filter) {
    case 'today':
      startDate = new Date(today.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(today.setDate(today.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(today.setMonth(today.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(today.setFullYear(today.getFullYear() - 1));
      break;
    default:
      if (!range?.from) {
        startDate = new Date(today.setMonth(today.getMonth() - 1));
      }
  }

  return { startDate, endDate };
};