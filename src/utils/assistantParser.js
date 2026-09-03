import { addDays, setHours, setMinutes, setMonth, setDate } from 'date-fns';

/**
 * Professional Spanish Natural Language Event Parser (Deterministic, High Precision)
 * Converts natural Spanish phrases into structured event objects without external API dependencies.
 *
 * Supported Examples:
 * - "Agendar gym mañana a las 7 AM"
 * - "Recordar pagar servicios este viernes a las 5 PM"
 * - "Entrega de proyecto React el próximo lunes a las 10:00"
 * - "Cita médica el 15 de septiembre a las 3 de la tarde"
 */
export const parseNaturalLanguageEvent = (inputText = '') => {
  const text = inputText.trim();
  const lowerText = text.toLowerCase();
  const now = new Date();

  let type = 'task';
  let isRecurring = false;
  let daysOfWeek = [1];
  let category = 'task';

  // 1. Detect Event Type & Category
  if (/(gym|gimnasio|entrenamiento|rutina|entrenar|ejercicio|crossfit|cardio|pierna|brazo|pecho)/i.test(lowerText)) {
    type = 'gym';
    category = 'gym';
    isRecurring = true;
  } else if (/(entrega|proyecto|parcial|examen|presentacion|presentación|deadline|tarea final)/i.test(lowerText)) {
    type = 'project';
    category = 'project';
  } else if (/(recordar|recordatorio|aviso|pagar|alerta|cita|medico|médico|doctor|reunion|reunión|factura)/i.test(lowerText)) {
    type = 'reminder';
    category = 'reminder';
  }

  // 2. Detect Date
  let targetDate = new Date(now.getTime());

  // Check specific month/day e.g., "15 de septiembre" or "20 de octubre"
  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const monthRegex = new RegExp(`(?:el\\s+)?(\\d{1,2})\\s+de\\s+(${monthNames.join('|')})`, 'i');
  const monthMatch = lowerText.match(monthRegex);

  if (monthMatch) {
    const dayNum = parseInt(monthMatch[1], 10);
    const monthIndex = monthNames.indexOf(monthMatch[2].toLowerCase());
    if (monthIndex !== -1 && dayNum >= 1 && dayNum <= 31) {
      targetDate = setMonth(targetDate, monthIndex);
      targetDate = setDate(targetDate, dayNum);
      if (targetDate < now) {
        targetDate = setMonth(targetDate, monthIndex); // Next year if date past
      }
    }
  } else if (lowerText.includes('pasado mañana') || lowerText.includes('pasado manana')) {
    targetDate = addDays(now, 2);
  } else if (lowerText.includes('mañana') || lowerText.includes('manana')) {
    targetDate = addDays(now, 1);
  } else if (lowerText.includes('hoy')) {
    targetDate = now;
  } else {
    // Check weekdays
    const dayMap = [
      { name: 'domingo', iso: 7, js: 0 },
      { name: 'lunes', iso: 1, js: 1 },
      { name: 'martes', iso: 2, js: 2 },
      { name: 'miércoles', iso: 3, js: 3 },
      { name: 'miercoles', iso: 3, js: 3 },
      { name: 'jueves', iso: 4, js: 4 },
      { name: 'viernes', iso: 5, js: 5 },
      { name: 'sábado', iso: 6, js: 6 },
      { name: 'sabado', iso: 6, js: 6 }
    ];

    for (const d of dayMap) {
      if (lowerText.includes(d.name)) {
        targetDate = getNextDayOfWeek(now, d.js);
        daysOfWeek = [d.iso];
        break;
      }
    }
  }

  // 3. Detect Time (12h & 24h & "de la tarde/mañana/noche")
  let targetHour = 9;
  let targetMinute = 0;

  // Check phrases like "5 de la tarde", "8 de la mañana", "9 de la noche"
  const periodMatch = lowerText.match(/(\d{1,2})(?::(\d{2}))?\s*(?:de la\s+)?(mañana|manana|tarde|noche)/i);
  if (periodMatch) {
    let h = parseInt(periodMatch[1], 10);
    const m = periodMatch[2] ? parseInt(periodMatch[2], 10) : 0;
    const period = periodMatch[3].toLowerCase();

    if ((period === 'tarde' || period === 'noche') && h < 12) h += 12;
    if ((period === 'mañana' || period === 'manana') && h === 12) h = 0;

    targetHour = h;
    targetMinute = m;
  } else {
    // Standard am/pm or 24h match e.g. "a las 7:30 am", "a las 18:00", "7 pm"
    const standardTimeMatch = lowerText.match(/(?:a las\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (standardTimeMatch) {
      let h = parseInt(standardTimeMatch[1], 10);
      const m = standardTimeMatch[2] ? parseInt(standardTimeMatch[2], 10) : 0;
      const ampm = standardTimeMatch[3] ? standardTimeMatch[3].toLowerCase() : null;

      if (ampm === 'pm' && h < 12) h += 12;
      if (ampm === 'am' && h === 12) h = 0;

      if (h >= 0 && h <= 23) {
        targetHour = h;
        targetMinute = m;
      }
    }
  }

  // 4. Professional Title Extraction
  let title = text
    // Remove action prefixes
    .replace(/^(?:agendar|programar|crear|añadir|anadir|poner|recordar|recordarme|tengo|hay|hacer)\s+/i, '')
    // Remove date references
    .replace(/(?:pasado mañana|pasado manana|mañana|manana|hoy|el próximo|el proximo|este|el)\s+(?:lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)?/gi, '')
    .replace(/(?:el\s+)?\d{1,2}\s+de\s+(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/gi, '')
    // Remove time references
    .replace(/(?:a las\s+)?\d{1,2}(?::\d{2})?\s*(?:am|pm|de la tarde|de la mañana|de la manana|de la noche)?/gi, '')
    .replace(/(?:lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)/gi, '')
    .trim();

  // Cleanup stray punctuation or double spaces
  title = title.replace(/^[-:\s,]+|[-:\s,]+$/g, '').trim();

  if (!title || title.length < 2) {
    switch (type) {
      case 'gym': title = 'Sesión de Entrenamiento'; break;
      case 'project': title = 'Entrega de Proyecto'; break;
      case 'reminder': title = 'Recordatorio Importante'; break;
      default: title = 'Nueva Tarea Agenda'; break;
    }
  }

  // Capitalize properly
  title = title.charAt(0).toUpperCase() + title.slice(1);

  const startDate = setMinutes(setHours(targetDate, targetHour), targetMinute);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  return {
    title,
    description: `Instrucción procesada: "${text}"`,
    type,
    category,
    startDateTime: startDate,
    endDateTime: endDate,
    isRecurring,
    daysOfWeek,
    reminderMinutesBefore: [15],
    completed: false
  };
};

function getNextDayOfWeek(date, dayOfWeek) {
  const resultDate = new Date(date.getTime());
  const currentDay = date.getDay();
  let distance = dayOfWeek - currentDay;
  if (distance <= 0) distance += 7;
  resultDate.setDate(date.getDate() + distance);
  return resultDate;
}
