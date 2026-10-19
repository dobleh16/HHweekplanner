import { safeToDate, getStartOfWeek, getEndOfWeek, isSameDay } from './dateHelpers';
import { addDays, addWeeks, addMonths, setHours, setMinutes, getDay, isBefore, isAfter, startOfDay } from 'date-fns';

/**
 * Normalizes day of week to 1=Monday, 2=Tuesday, ..., 7=Sunday
 */
export const getISOWeekDay = (date) => {
  const jsDay = getDay(date); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  return jsDay === 0 ? 7 : jsDay;
};

/**
 * Returns all occurrence dates for an event within the target week range,
 * supporting: weekly, daily, biweekly (every 2 weeks), monthly frequencies.
 */
const getOccurrencesInRange = (evt, rangeStart, rangeEnd) => {
  const baseStart = safeToDate(evt.startDateTime);
  const baseEnd = safeToDate(evt.endDateTime);
  const durationMs = Math.max(15 * 60 * 1000, baseEnd - baseStart);

  const frequency = evt.recurrenceRule?.frequency || 'weekly';
  const daysOfWeek = evt.recurrenceRule?.daysOfWeek || [];
  const recurrenceEnd = evt.recurrenceRule?.endDate
    ? new Date(evt.recurrenceRule.endDate)
    : null;

  const occurrences = [];

  if (frequency === 'daily') {
    // Iterate day by day in range
    let cursor = new Date(rangeStart);
    while (!isAfter(cursor, rangeEnd)) {
      if (!isBefore(cursor, startOfDay(baseStart))) {
        if (!recurrenceEnd || !isAfter(cursor, recurrenceEnd)) {
          const virtualStart = setMinutes(setHours(cursor, baseStart.getHours()), baseStart.getMinutes());
          occurrences.push(virtualStart);
        }
      }
      cursor = addDays(cursor, 1);
    }

  } else if (frequency === 'weekly') {
    // Iterate each day of the week range and match daysOfWeek
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const day = addDays(rangeStart, dayOffset);
      const isoDay = getISOWeekDay(day);
      if (daysOfWeek.includes(isoDay) && !isBefore(day, startOfDay(baseStart))) {
        if (!recurrenceEnd || !isAfter(day, recurrenceEnd)) {
          occurrences.push(setMinutes(setHours(day, baseStart.getHours()), baseStart.getMinutes()));
        }
      }
    }

  } else if (frequency === 'biweekly') {
    // Every 2 weeks, on the same days of week as the original
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const day = addDays(rangeStart, dayOffset);
      const isoDay = getISOWeekDay(day);
      if (!daysOfWeek.includes(isoDay)) continue;
      if (isBefore(day, startOfDay(baseStart))) continue;
      if (recurrenceEnd && isAfter(day, recurrenceEnd)) continue;

      // Check if this week is an "on" week (same parity as origin week)
      const weeksSinceOrigin = Math.round(
        (startOfDay(day) - startOfDay(baseStart)) / (7 * 24 * 60 * 60 * 1000)
      );
      if (weeksSinceOrigin % 2 === 0) {
        occurrences.push(setMinutes(setHours(day, baseStart.getHours()), baseStart.getMinutes()));
      }
    }

  } else if (frequency === 'monthly') {
    // Same day of month as the original event
    const targetDayOfMonth = baseStart.getDate();
    let cursor = new Date(rangeStart);
    while (!isAfter(cursor, rangeEnd)) {
      if (cursor.getDate() === targetDayOfMonth) {
        if (!isBefore(cursor, startOfDay(baseStart))) {
          if (!recurrenceEnd || !isAfter(cursor, recurrenceEnd)) {
            occurrences.push(setMinutes(setHours(cursor, baseStart.getHours()), baseStart.getMinutes()));
          }
        }
      }
      cursor = addDays(cursor, 1);
    }
  }

  return occurrences.map(virtualStart => ({
    durationMs,
    virtualStart
  }));
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

    if (!evt.isRecurring || !evt.recurrenceRule) {
      // One-time event
      expandedList.push({
        ...evt,
        isVirtual: false,
        computedStart: startObj,
        computedEnd: endObj
      });
      return;
    }

    // Recurring event — get occurrences in week
    const occurrences = getOccurrencesInRange(evt, startOfTargetWeek, endOfTargetWeek);

    occurrences.forEach(({ virtualStart, durationMs }) => {
      const virtualEnd = new Date(virtualStart.getTime() + durationMs);
      const isoDay = getISOWeekDay(virtualStart);
      const virtualId = `${evt.id}_virtual_${isoDay}_${virtualStart.getTime()}`;

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
    });
  });

  return expandedList;
};

// Re-export for backward compatibility
export { addWeeks, addMonths };
