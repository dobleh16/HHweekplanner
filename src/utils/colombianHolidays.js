import { addDays, isSameDay, getMonth, getYear } from 'date-fns';

/**
 * Calculates Easter Sunday for a given year using Meeus/Jones/Butcher algorithm
 */
export const getEasterSunday = (year) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

/**
 * Moves a date to the following Monday if it does not fall on a Monday (Ley Emiliani)
 */
const nextMonday = (date) => {
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  if (dayOfWeek === 1) return date;
  const daysToAdd = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  return addDays(date, daysToAdd);
};

/**
 * Returns all official Colombian holidays for a specified year
 */
export const getColombianHolidays = (year = new Date().getFullYear()) => {
  const easter = getEasterSunday(year);

  const holidays = [
    // 1. Fixed Date Holidays
    { date: new Date(year, 0, 1), name: 'Año Nuevo' },
    { date: new Date(year, 4, 1), name: 'Día del Trabajo' },
    { date: new Date(year, 6, 20), name: 'Día de la Independencia' },
    { date: new Date(year, 7, 7), name: 'Batalla de Boyacá' },
    { date: new Date(year, 11, 8), name: 'Día de la Inmaculada Concepción' },
    { date: new Date(year, 11, 25), name: 'Navidad' },

    // 2. Ley Emiliani Holidays (Moved to next Monday)
    { date: nextMonday(new Date(year, 0, 6)), name: 'Día de los Reyes Magos' },
    { date: nextMonday(new Date(year, 2, 19)), name: 'Día de San José' },
    { date: nextMonday(new Date(year, 5, 29)), name: 'San Pedro y San Pablo' },
    { date: nextMonday(new Date(year, 7, 15)), name: 'La Asunción de la Virgen' },
    { date: nextMonday(new Date(year, 9, 12)), name: 'Día de la Raza' },
    { date: nextMonday(new Date(year, 10, 1)), name: 'Día de Todos los Santos' },
    { date: nextMonday(new Date(year, 10, 11)), name: 'Independencia de Cartagena' },

    // 3. Easter Relative Holidays
    { date: addDays(easter, -3), name: 'Jueves Santo' },
    { date: addDays(easter, -2), name: 'Viernes Santo' },
    { date: nextMonday(addDays(easter, 43)), name: 'Ascensión del Señor' },
    { date: nextMonday(addDays(easter, 64)), name: 'Corpus Christi' },
    { date: nextMonday(addDays(easter, 71)), name: 'Sagrado Corazón de Jesús' }
  ];

  return holidays.sort((a, b) => a.date - b.date);
};

/**
 * Checks if a given date is a Colombian holiday
 */
export const getColombianHolidayInfo = (targetDate) => {
  if (!targetDate) return null;
  const d = targetDate instanceof Date ? targetDate : new Date(targetDate);
  const year = getYear(d);
  const holidays = getColombianHolidays(year);

  return holidays.find((h) => isSameDay(h.date, d)) || null;
};

/**
 * Returns all Colombian holidays in a specified month
 */
export const getColombianHolidaysForMonth = (referenceDate = new Date()) => {
  const d = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  const year = getYear(d);
  const month = getMonth(d);
  const holidays = getColombianHolidays(year);

  return holidays.filter((h) => getMonth(h.date) === month);
};
