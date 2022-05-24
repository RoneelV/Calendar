import { Fragment, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import Event from './Event';

/**
 * converts event[] to {[eventDate]: event[]}
 * @param {import('../mockEvents').event[]} eventList
 * @returns {Object.<string, import('../mockEvents').event[]>}
 */
const getDateWiseEvents = (eventList) =>
  eventList.reduce(
    (prev, cur) => ({
      ...prev,
      [cur.eventDate]: [...(prev[cur.eventDate] || []), cur],
    }),
    {}
  );

/**
 * @param {{displayEvents: import('../mockEvents').event[], splitIndex: number, startDate: string}} param
 */
const EventList = ({ displayEvents, splitIndex, startDate }) => {
  const dateEvents = useMemo(
    () => getDateWiseEvents(displayEvents),
    [displayEvents]
  );

  const noUpcomingEvents = splitIndex == 0 || displayEvents.length == 0;

  return (
    <div className="flex flex-col space-y-[4.5rem]">
      {noUpcomingEvents ? (
        <div className="flex flex-col space-y-[4.5rem]">
          <h1 className="heading-s ml-6 text-[#999999] max-w-xs">
            No sessions scheduled {format(parseISO(startDate), 'EEEE, d MMMM')}{' '}
            onwards
          </h1>
        </div>
      ) : (
        !dateEvents[startDate] && (
          <h1 className="heading-s ml-6 text-[#999999] max-w-xs">
            No sessions scheduled for{' '}
            {format(parseISO(startDate), 'EEEE, d MMMM')}
          </h1>
        )
      )}

      {Object.entries(dateEvents).map(([date, events], index) => (
        <div key={'heading-date-' + date}>
          {index == splitIndex && (
            <h1 className="heading-s mb-4">Past Events</h1>
          )}

          <h2 className="heading-xs ml-[1.6875rem] mb-2">
            {format(parseISO(date), 'EEE, d MMMM')}
          </h2>
          <div className="flex flex-col">
            {events.map((event, index) => (
              <Fragment key={'event-' + event.eventId}>
                {index > 0 ? <hr className="text-[#eaeaea]" /> : <></>}
                <Event event={event} />
              </Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
