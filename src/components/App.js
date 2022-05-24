import React, { useMemo, useState, useTransition } from 'react';
import EventList from './EventList';
import Loading from './Loading';
import Filters from './Filters';
import Searchbar from './Searchbar';
import MiniCalendar from './MiniCalendar';
import initialEventsList from '../eventsList.json';
import { formatISO } from 'date-fns';
import { useFilters } from '../utils/useFilters';
import { useDateFilter } from '../utils/useDateFilter';

function App() {
  // eslint-disable-next-line
  const [eventsList, setEventsList] = useState(() =>
    // eventDate is formatted as yyyy-MM-dd so can compare as string
    initialEventsList.sort((a, b) => (a.eventDate < b.eventDate ? -1 : 1))
  );

  /**
   *  Stores *every* tag from all events as key, with the number of events having the tag as value
   *  @type {Object.<string, number>}
   */
  const tags = useMemo(
    () =>
      eventsList.reduce(
        (prev, cur) => ({
          ...prev,
          ...cur.tags.reduce((p, c) => ({ ...p, [c]: (prev[c] || 0) + 1 }), {}),
        }),
        {}
      ),
    [eventsList]
  );

  // input states
  /** @type {[string[], React.Dispatch<React.SetStateAction<string[]>]} */
  const [checkedTags, setCheckedTags] = useState([]);
  /** @type {[string[], React.Dispatch<React.SetStateAction<string[]>]} */
  const [checkedStatus, setCheckedStatus] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedDate, setSelectedDate] = useState(
    formatISO(new Date(), { representation: 'date' })
  );

  const [isPending, startTransition] = useTransition();

  /** @type {(fn: (...args: any[]) => void) => ((...args: any[]) => void)} */
  const getDeferredFn =
    (fn) =>
    (...args) =>
      startTransition(() => fn(...args));

  const deferredSetSearchQuery = getDeferredFn(setSearchQuery);
  const deferredSetCheckedTags = getDeferredFn(setCheckedTags);
  const deferredSetCheckedStatus = getDeferredFn(setCheckedStatus);
  const deferredSetSelectedDate = getDeferredFn(setSelectedDate);

  const datesWithEvents = useMemo(
    () =>
      eventsList.reduce(
        (prev, cur) =>
          prev.includes(cur.eventDate) ? prev : [...prev, cur.eventDate],
        []
      ),
    [eventsList]
  );

  const [filteredEvents, areFiltersActive] = useFilters(
    eventsList,
    checkedTags,
    checkedStatus,
    searchQuery
  );

  const [displayEvents, splitIndex] = useDateFilter(
    filteredEvents,
    areFiltersActive,
    selectedDate
  );

  return (
    <div className="p-12">
      <div className="flex justify-between space-x-4 mb-16 ml-2">
        <Filters
          tags={tags}
          checkedTags={checkedTags}
          setCheckedTags={deferredSetCheckedTags}
          checkedStatus={checkedStatus}
          setCheckedStatus={deferredSetCheckedStatus}
        />
        <Searchbar
          searchQuery={searchQuery}
          setSearchQuery={deferredSetSearchQuery}
        />
      </div>

      {isPending ? (
        <Loading />
      ) : (
        <div className="flex justify-between">
          <EventList
            displayEvents={displayEvents}
            splitIndex={splitIndex}
            startDate={selectedDate}
          />
          <MiniCalendar
            selectedDateString={selectedDate}
            setSelectedDate={deferredSetSelectedDate}
            datesWithEvents={datesWithEvents}
          />
        </div>
      )}
    </div>
  );
}

export default App;
