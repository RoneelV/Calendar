import Calendar from 'react-calendar';
import {
  endOfMonth,
  format,
  formatISO,
  isSameDay,
  isToday,
  isWithinInterval,
  parseISO,
  startOfMonth,
} from 'date-fns';
import LeftArrow from '../assets/arrow-ios-left.svg';
import RightArrow from '../assets/arrow-ios-right.svg';
import './MiniCalendar.css';

/** @type {(date: Date, currentDate: Date) => boolean} */
const isDateWithinCurrentMonth = (date, currentDate) => {
  /** @type {import('date-fns').Interval} */
  const currentMonthInterval = {
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  };

  return isWithinInterval(date, currentMonthInterval);
};

/**
 * @param {Date} date
 * @param {Date} currentDate
 * @param {string[]} datesWithEvents
 */
const customTileContent = (date, currentDate, datesWithEvents) => {
  return (
    <div
      className={
        'flex flex-col justify-center w-10 h-10 mx-[0.28125rem] my-[0.4375rem] leading-10  rounded-[50%]' +
        // shows light gray circle around the day if there are any events scheduled that day
        (datesWithEvents.includes(formatISO(date, { representation: 'date' }))
          ? ' border border-border-dark'
          : '') +
        // highlights the current selected day
        (isSameDay(date, currentDate) ? ' bg-black text-white' : '') +
        (isToday(date) ? ' border border-black' : '')
      }
    >
      <p
        className={
          'body-s font-medium w-full relative' +
          (isDateWithinCurrentMonth(date, currentDate)
            ? ''
            : ' text-placeholder')
        }
      >
        <abbr aria-label={format(date, 'MMMM d, yyyy')}>
          {format(date, 'd')}
        </abbr>
      </p>
    </div>
  );
};

/** @param {{selectedDateString: string, setSelectedDate: Function, datesWithEvents: string[]}} param */
const MiniCalendar = ({
  selectedDateString,
  setSelectedDate,
  datesWithEvents,
}) => {
  const selectedDate = parseISO(selectedDateString);

  return (
    <Calendar
      className="w-[25rem] h-fit max-w-full px-6 py-7 border border-border-default rounded-xl"
      value={selectedDate}
      onChange={(e) =>
        setSelectedDate(formatISO(e, { representation: 'date' }))
      }
      onActiveStartDateChange={({ activeStartDate }) => {
        // going to prev/next month will result in first day of the month being selected
        setSelectedDate(formatISO(activeStartDate, { representation: 'date' }));
      }}
      formatMonthYear={(locale, date) => format(date, 'MMMM, yyyy')}
      formatDay={() => ''} // hide as custom tile already shows dates
      minDetail="month"
      nextLabel={<img src={RightArrow} alt="Next" />}
      prevLabel={<img src={LeftArrow} alt="Previous" />}
      next2Label={null} // hides the next2 button
      prev2Label={null}
      tileContent={({ date }) =>
        customTileContent(date, selectedDate, datesWithEvents)
      }
      tileDisabled={({ date }) => !isDateWithinCurrentMonth(date, selectedDate)}
    />
  );
};

export default MiniCalendar;
