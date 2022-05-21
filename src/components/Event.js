import { format, intervalToDuration, parseISO } from 'date-fns';
import peopleIcon from '../assets/people.svg';
import seatIcon from '../assets/seat-normal.svg';
import hotSeatIcon from '../assets/seat-orange.svg';

const RegisteredBadge = () => (
  <div className="flex w-fit px-3 py-0.5 h-6 rounded-[22px] backdrop-blur-[10px] bg-[#444444]">
    <p className="leading-5 uppercase text-[12px] font-semibold text-[#f2f2f2] tracking-widest">
      REGISTERED
    </p>
  </div>
);

/**
 * @param {{icon: string, text: string}} param
 */
const InfoWithIcon = ({ icon, text }) => (
  <span className="flex space-x-2 items-center">
    <img className="h-5" src={icon} alt="" aria-hidden={true} />
    <p className="body-s">{text}</p>
  </span>
);

/**
 * Shows Registered Badge if registered, otherwise Seats left and Total attendees info
 * Shows filling fast orange seat icon if seats left are less than 10
 * @param {{hasRegistered: boolean, seatsLeft: number?, totalAttendees: number?}} param
 */
const RegisteredOrSeatsInfo = ({
  hasRegistered,
  seatsLeft,
  totalAttendees,
}) => {
  if (hasRegistered) {
    return (
      <div className="mt-[10px]">
        <RegisteredBadge />
      </div>
    );
  }

  if (totalAttendees == undefined && seatsLeft == undefined) return <></>;

  return (
    <div className="mt-3">
      <div className="flex w-fit space-x-8">
        {totalAttendees != undefined && (
          <InfoWithIcon
            icon={peopleIcon}
            text={`${totalAttendees} attending`}
          />
        )}
        {seatsLeft != undefined &&
          (seatsLeft < 10 ? (
            <InfoWithIcon icon={hotSeatIcon} text={`${seatsLeft} seats left`} />
          ) : (
            <InfoWithIcon icon={seatIcon} text={`${seatsLeft} seats left`} />
          ))}
      </div>
    </div>
  );
};

/**
 * Shows start time, end time and duration in the required formats
 * @param {{eventDate: string, startTime: string?, endTime: string?}} param
 */
const EventTimeInfo = ({ eventDate, startTime, endTime }) => {
  const parsedStartTime = parseISO(eventDate + 'T' + startTime);
  const parsedEndTime = parseISO(eventDate + 'T' + endTime);
  const duration = intervalToDuration({
    start: parsedStartTime,
    end: parsedEndTime,
  });
  const displayStartTime = format(parsedStartTime, 'h:mma');
  const displayEndTime = format(parsedEndTime, 'h:mm a zzz');
  const displayDuration =
    (duration.hours ? `${duration.hours} hours ` : '') +
    (duration.minutes ? `${duration.minutes} mins` : '');

  return (
    <p className="body-s">
      {displayStartTime} - {displayEndTime} • {displayDuration}
    </p>
  );
};

/** @param {{event: import('../mockEvents').event}} param */
const Event = ({ event }) => (
  <article className="flex w-full p-6 rounded-xl hover:bg-[#fafafa]">
    <img
      src={event.imageURL}
      alt="Event banner"
      className="object-cover rounded-lg h-[6.75rem] w-36"
      loading="lazy"
    />

    <div className="ml-6 pt-2 w-fit">
      <h3 className="heading-s text-[#222222] mb-2">{event.eventName}</h3>

      <EventTimeInfo
        eventDate={event.eventDate}
        startTime={event.startTime}
        endTime={event.endTime}
      />

      <RegisteredOrSeatsInfo
        hasRegistered={event.hasRegistered}
        seatsLeft={event.seatsLeft}
        totalAttendees={event.totalAttendees}
      />
    </div>
  </article>
);

export default Event;
export { EventTimeInfo, RegisteredOrSeatsInfo }; // for testing
