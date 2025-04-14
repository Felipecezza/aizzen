import { DateRange } from "react-day-picker";

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