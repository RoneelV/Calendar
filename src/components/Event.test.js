import { render, screen } from '@testing-library/react';
import faker from '@faker-js/faker';
import Event from './Event';
import { endOfDay, min, startOfDay, formatISO, max } from 'date-fns';

const eventFactory = () => {
  const eventDate = faker.date.between();

  const timePair = faker.date.betweens(
    startOfDay(eventDate),
    endOfDay(eventDate)
  );

  return {
    eventId: faker.database.mongodbObjectId(),
    eventName: faker.random.words(4),
    eventDate: formatISO(eventDate, { representation: 'date' }),
    startTime: formatISO(min(timePair), { representation: 'time' }),
    endTime: formatISO(max(timePair), { representation: 'time' }),
    hasRegistered: faker.datatype.boolean(),
    imageURL: 'https://loremflickr.com/640/480/people',
    instructors: faker.helpers.uniqueArray(
      faker.name.findName,
      faker.datatype.number({ min: 1, max: 2 })
    ),
    tags: faker.helpers.uniqueArray(
      faker.random.word(),
      faker.datatype.number({ min: 1, max: 2 })
    ),
    totalAttendees: faker.datatype.number({ min: 0, max: 999 }),
    seatsLeft: faker.datatype.number({ min: 0, max: 999 }),
  };
};

let event = eventFactory();

test('renders registered badge if registered', () => {
  event.hasRegistered = true;

  const { rerender } = render(<Event event={event} />);

  let registeredElement = screen.queryByText('REGISTERED');
  let seatsLeftElement = screen.queryByText(/\d+ seats left/);
  let peopleAttendingElement = screen.queryByText(/\d+ attending/);

  expect(registeredElement).toBeInTheDocument();
  expect(seatsLeftElement).toBeNull();
  expect(peopleAttendingElement).toBeNull();

  rerender(<Event event={{ ...event, hasRegistered: false }} />);

  registeredElement = screen.queryByText('REGISTERED');
  seatsLeftElement = screen.queryByText(/\d+ seats left/);
  peopleAttendingElement = screen.queryByText(/\d+ attending/);

  expect(registeredElement).toBeNull();
  // seats left and people attending are not undefined
  expect(seatsLeftElement).toBeInTheDocument();
  expect(peopleAttendingElement).toBeInTheDocument();
});
