import { safeToDate, getStartOfWeek, getEndOfWeek, isSameDay } from './dateHelpers';
import { addDays, setHours, setMinutes, getDay, isBefore } from 'date-fns';

/**
 * Normalizes day of week to 1=Monday, 2=Tuesday, ..., 7=Sunday
 */
export const getISOWeekDay = (date) => {
  const jsDay = getDay(date); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  return jsDay === 0 ? 7 : jsDay;
};

/**
 * Expands recurring events into concrete virtual instances for a specified date range.
 * @param {Array} events - List of base event documents from Firestore
 * @param {Date} weekReferenceDate - Reference date inside target week
 * @returns {Array} List containing all non-recurring events + generated virtual recurring event instances
 */
export const expandEventsForWeek = (events = [], weekReferenceDate = new Date()) => {
  const startOfTargetWeek = getStartOfWeek(weekReferenceDate);
  const endOfTargetWeek = getEndOfWeek(weekReferenceDate);
  const expandedList = [];

  events.forEach((evt) => {
    const startObj = safeToDate(evt.startDateTime);
    const endObj = safeToDate(evt.endDateTime);
    const durationMinutes = Math.max(15, Math.round((endObj - startObj) / (1000 * 60)));

    if (!evt.isRecurring || !evt.recurrenceRule || !evt.recurrenceRule.daysOfWeek) {
      // One-time event
      expandedList.push({
        ...evt,
        isVirtual: false,
        computedStart: startObj,
        computedEnd: endObj
      });
      return;
    }

    // Recurring event (e.g. Gym schedules)
    const daysOfWeek = evt.recurrenceRule.daysOfWeek || []; // Array of day numbers, e.g. [1, 3, 5] for Mon, Wed, Fri
    
    // Check each day of the target week
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentWeekDayDate = addDays(startOfTargetWeek, dayOffset);
      const isoDay = getISOWeekDay(currentWeekDayDate);

      if (daysOfWeek.includes(isoDay)) {
        // Build virtual start and end date for this day
        const virtualStart = setMinutes(
          setHours(currentWeekDayDate, startObj.getHours()), 
          startObj.getMinutes()
        );
        const virtualEnd = new Date(virtualStart.getTime() + durationMinutes * 60 * 1000);

        // Only include if original event start is not in the future beyond this virtual date
        if (!isBefore(virtualStart, startObj) || isSameDay(virtualStart, startObj)) {
          const virtualId = `${evt.id}_virtual_${isoDay}_${currentWeekDayDate.getTime()}`;
          expandedList.push({
            ...evt,
            id: virtualId,
            baseEventId: evt.id,
            isVirtual: true,
            computedStart: virtualStart,
            computedEnd: virtualEnd,
            startDateTime: virtualStart,
            endDateTime: virtualEnd
          });
        }
      }
    }
  });

  return expandedList;
};
