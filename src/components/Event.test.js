import { render, screen } from '@testing-library/react';
import faker from '@faker-js/faker';
import { RegisteredOrSeatsInfo, EventTimeInfo } from './Event';
import { formatISO, format } from 'date-fns';

test.each([
  [faker.datatype.number(100), faker.datatype.number(100)],
  [0, 0],
  [0, undefined],
  [undefined, 0],
  [undefined, undefined],
])('renders registered badge if registered', (seatsLeft, totalAttendees) => {
  render(
    <RegisteredOrSeatsInfo
      hasRegistered={true}
      seatsLeft={seatsLeft}
      totalAttendees={totalAttendees}
    />
  );

  let registeredElement = screen.queryByText('REGISTERED');
  let seatsLeftElement = screen.queryByText(/\d+ seats left/);
  let peopleAttendingElement = screen.queryByText(/\d+ attending/);

  expect(registeredElement).toBeInTheDocument();
  expect(seatsLeftElement).toBeNull();
  expect(peopleAttendingElement).toBeNull();
});

test.each([
  [faker.datatype.number(100), faker.datatype.number(100)],
  [0, 0],
  [0, undefined],
  [undefined, 0],
  [undefined, undefined],
])(
  'renders seats left and people attending info correctly',
  (seatsLeft, totalAttendees) => {
    render(
      <RegisteredOrSeatsInfo
        hasRegistered={false}
        seatsLeft={seatsLeft}
        totalAttendees={totalAttendees}
      />
    );

    let registeredElement = screen.queryByText('REGISTERED');
    let seatsLeftElement = screen.queryByText(/\d+ seats left/);
    let peopleAttendingElement = screen.queryByText(/\d+ attending/);

    expect(registeredElement).toBeNull();

    if (seatsLeft != undefined) {
      expect(seatsLeftElement).toBeInTheDocument();
    } else {
      expect(seatsLeftElement).toBeNull();
    }

    if (totalAttendees != undefined) {
      expect(peopleAttendingElement).toBeInTheDocument();
    } else {
      expect(peopleAttendingElement).toBeNull();
    }
  }
);

const eventDate = formatISO(faker.date.between(), { representation: 'date' });
const timezoneISOSuffix = format(new Date(), 'XXX');
const timezoneLocalSuffix = format(new Date(), 'zzz');
test.each([
  [
    '00:00:00' + timezoneISOSuffix,
    '12:00:00' + timezoneISOSuffix,
    '12:00AM',
    '12:00 PM ' + timezoneLocalSuffix,
    '12 hours',
  ],
  [
    '11:58:59' + timezoneISOSuffix,
    '12:00:00' + timezoneISOSuffix,
    '11:58AM',
    '12:00 PM ' + timezoneLocalSuffix,
    '1 mins',
  ],
])(
  'renders time info correctly',
  (
    startTime,
    endTime,
    expectedStartTime,
    expectedEndTime,
    expectedDuration
  ) => {
    render(
      <EventTimeInfo
        eventDate={eventDate}
        startTime={startTime}
        endTime={endTime}
      />
    );

    let startTimeElement = screen.getByText(expectedStartTime, {
      exact: false,
    });
    let endTimeElement = screen.getByText(expectedEndTime, { exact: false });
    let durationElement = screen.getByText(expectedDuration, { exact: false });

    expect(startTimeElement).toBeInTheDocument();
    expect(endTimeElement).toBeInTheDocument();
    expect(durationElement).toBeInTheDocument();
  }
);
