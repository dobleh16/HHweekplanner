import { 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  format, 
  isSameDay, 
  isToday as checkIsToday, 
  differenceInHours,
  differenceInMinutes,
  parseISO,
  isBefore,
  isAfter
} from 'date-fns';
import { es } from 'date-fns/locale';

// Ensure week starts on Monday (weekStartsOn: 1)
export const getStartOfWeek = (date = new Date()) => {
  return startOfWeek(date, { weekStartsOn: 1 });
};

export const getEndOfWeek = (date = new Date()) => {
  return endOfWeek(date, { weekStartsOn: 1 });
};

export const getWeekDays = (referenceDate = new Date()) => {
  const start = getStartOfWeek(referenceDate);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const formatDisplayDate = (date, formatStr = 'dd MMM yyyy') => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return format(d, formatStr, { locale: es });
};

export const formatDisplayTime = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return format(d, 'HH:mm', { locale: es });
};

export const formatFullDateTime = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return format(d, "eeee d 'de' MMMM, HH:mm", { locale: es });
};

export const safeToDate = (value) => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value.toDate === 'function') return value.toDate(); // Firestore Timestamp
  if (typeof value === 'string') return parseISO(value);
  if (typeof value === 'number') return new Date(value);
  if (value.seconds) return new Date(value.seconds * 1000);
  return new Date();
};

export { isSameDay, checkIsToday as isToday, isBefore, isAfter };

export const getProjectUrgency = (deadlineDate) => {
  if (!deadlineDate) return 'normal';
  const target = safeToDate(deadlineDate);
  const now = new Date();
  const hoursLeft = differenceInHours(target, now);

  if (hoursLeft < 0) return 'expired';
  if (hoursLeft <= 24) return 'urgent'; // Soft Red / Urgent Amber
  if (hoursLeft <= 48) return 'warning'; // Amber
  return 'normal';
};

export const getFormattedHoursLeft = (deadlineDate) => {
  if (!deadlineDate) return '';
  const target = safeToDate(deadlineDate);
  const now = new Date();
  const minsLeft = differenceInMinutes(target, now);

  if (minsLeft < 0) return 'Vencido';
  if (minsLeft < 60) return `Quedan ${minsLeft} min`;
  const hoursLeft = Math.floor(minsLeft / 60);
  if (hoursLeft < 24) return `Quedan ${hoursLeft} h`;
  const daysLeft = Math.floor(hoursLeft / 24);
  return `Quedan ${daysLeft} d`;
};

// Generate time slots (default 06:00 to 23:00)
export const generateTimeSlots = (startHour = 6, endHour = 23) => {
  const slots = [];
  for (let h = startHour; h <= endHour; h++) {
    const formattedHour = h < 10 ? `0${h}:00` : `${h}:00`;
    slots.push({ hour: h, label: formattedHour });
  }
  return slots;
};
