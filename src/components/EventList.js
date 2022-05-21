import { Fragment } from 'react';
import { format, parseISO } from 'date-fns';
import Event from './Event';

/**
 * @param {{dateEvents: Object.<string, import('../mockEvents').event[]>}} param
 */
const EventList = ({ dateEvents }) => {
  return (
    <div className="flex flex-col space-y-[4.5rem]">
      {Object.entries(dateEvents).map(([date, events]) => (
        <div key={'heading-date-' + date}>
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
