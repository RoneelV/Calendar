import { useMemo } from 'react';
import { formatISO, endOfMonth, parseISO } from 'date-fns';

/**
 * Supposed to run after the filters are applied.
 * If no filters are active, show all events starting from startDate to the end of the current month.
 * If filters are active, first show all events starting from startDate,
 * and then all past events, returns the index from where the past events start, alongside the array
 * @param {import('../mockEvents').event[]} filteredEvents assumes the array is sorted by date
 * @param {boolean} areFiltersActive
 * @param {string} startDate
 * @param {string} endDate
 * @param {boolean} showOnlyInRange primarily helpful for (not implemented yet) date-range filtering
 * @returns {[import('../mockEvents').event[], number]}
 */
export const useDateFilter = (
  filteredEvents,
  areFiltersActive,
  startDate,
  endDate = formatISO(endOfMonth(parseISO(startDate)), {
    representation: 'date',
  }),
  showOnlyInRange = false
) => {
  const [displayEvents, splitIndex] = useMemo(() => {
    const startIndex = filteredEvents.findIndex(
      ({ eventDate }) => eventDate >= startDate
    );
    const endIndex = filteredEvents.findIndex(
      ({ eventDate }) => eventDate > endDate
    );

    if (!areFiltersActive || showOnlyInRange) {
      if (startIndex == -1) {
        return [[], -1];
      }
      return [
        filteredEvents.slice(startIndex, endIndex == -1 ? undefined : endIndex),
        -1,
      ];
    }

    if (startIndex == -1) {
      // past events start from index 0
      return [filteredEvents, 0];
    }

    return [
      filteredEvents
        .slice(startIndex)
        .concat(filteredEvents.slice(0, startIndex)),
      filteredEvents.length - startIndex,
    ];
  }, [filteredEvents, areFiltersActive, startDate, endDate, showOnlyInRange]);

  return [displayEvents, splitIndex];
};
