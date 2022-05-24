import { useMemo } from 'react';
import { getEventStatus } from './getEventStatus';
/**
 * @description Takes a list of events and filter requirements,
 *  and returns a new array satisfying all filter requirements
 *  and a boolean showing if any filters are being applied at the moment
 * @param {import('../mockEvents').event[]} eventList
 * @param {string[]} checkedTags
 * @param {string[]} checkedStatus
 * @param {string} searchQuery
 * @returns {[import('../mockEvents').event[], boolean]}
 */
export const useFilters = (
  eventList,
  checkedTags,
  checkedStatus,
  searchQuery
) => {
  const areFiltersActive =
    checkedTags.length > 0 || checkedStatus.length > 0 || searchQuery != '';

  const filteredEvents = useMemo(() => {
    // short circuit if there is no need to apply filters
    if (!areFiltersActive) return eventList;

    return eventList.filter(
      ({ tags, seatsLeft, hasRegistered, eventName, instructors }) => {
        // events having any of checked tags will be shown
        // use tags.every instead of tags.some if the otherwise is desired
        const tagsFilter =
          checkedTags.length == 0 ||
          tags.some((tag) => checkedTags.includes(tag));

        const statusFilter =
          checkedStatus.length == 0 ||
          checkedStatus.includes(getEventStatus(seatsLeft, hasRegistered));

        const searchFilter =
          searchQuery == '' ||
          eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          instructors.some((instructor) =>
            instructor.toLowerCase().includes(searchQuery.toLowerCase())
          );

        return tagsFilter && statusFilter && searchFilter;
      }
    );
  }, [eventList, checkedTags, checkedStatus, searchQuery, areFiltersActive]);

  return [filteredEvents, areFiltersActive];
};
