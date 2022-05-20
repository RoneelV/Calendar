import { faker } from '@faker-js/faker';
import {
  format,
  add,
  sub,
  startOfToday,
  endOfToday,
  getHours,
  hoursToMinutes,
  getMinutes,
} from 'date-fns';
import { writeFile } from 'fs';

const totalEvents = faker.datatype.number({ min: 20, max: 60 });
const fileToWrite = 'eventsList.json';

/**
 * used to generate startDate and endDate by substracting and adding the duration to now
 * @type {import('date-fns').Duration}
 */
const durationFromNow = { months: 3 };
const startDate = sub(new Date(), durationFromNow);
const endDate = add(new Date(), durationFromNow);

/**
 * Takes a Date and returns the total number of minutes elapsed since the start of the day
 * @param {Date} time
 */
const getMinutesElapsedInDay = (time) =>
  hoursToMinutes(getHours(time)) + getMinutes(time);

/**
 * @type {Object.<string, () => boolean | number | string | string[] | Object.<string, string>>}
 */
let eventFactory = {
  eventId: () => faker.database.mongodbObjectId(),
  eventName: () => faker.company.bs(),
  eventDate: () => format(faker.date.between(startDate, endDate), 'yyyy-MM-dd'),
  timeInterval: () => {
    // add random amount of minutes to start of the day
    // returns any Date between 00:00 to 22:00 today, formatted as string
    let startTime = add(startOfToday(), {
      minutes: faker.datatype.number({ min: 0, max: 60 * 22, precision: 5 }),
    });

    // add random amount of minutes to the Date generated with startTime
    // returns any Date between startTime to 23:55 today, formatted as string
    let endTime = add(startTime, {
      minutes: faker.datatype.number({
        min: 20,
        max:
          getMinutesElapsedInDay(endOfToday()) -
          getMinutesElapsedInDay(startTime),
        precision: 5,
      }),
    });

    return {
      startTime: format(startTime, 'HH:mm:ssxxx'),
      endTime: format(endTime, 'HH:mm:ssxxx'),
    };
  },
  hasRegistered: () => faker.datatype.boolean(),
  imageURL: () => faker.image.people(),
  instructors: () =>
    faker.helpers.uniqueArray(
      faker.name.findName,
      faker.datatype.number({ min: 1, max: 2 })
    ),
  tags: () =>
    faker.helpers.arrayElements(
      [
        'Productivity',
        'Design',
        'Engineering',
        'Management',
        'Architecture',
        'Health',
      ],
      faker.datatype.number({ min: 1, max: 2 })
    ),
  totalAttendees: () => faker.datatype.number({ min: 20, max: 120 }),
  seatsLeft: () => faker.datatype.number({ min: 0, max: 70 }),
};

/**
 * @type {Array.<Object.<string, boolean | number | string | string[]>>}
 */
let events = [];
for (let i = 0; i < totalEvents; i++) {
  let event = Object.entries(eventFactory).reduce(
    (prev, cur) =>
      cur[0] == 'timeInterval'
        ? { ...prev, ...cur[1]() }
        : { ...prev, [cur[0]]: cur[1]() },
    {}
  );

  events.push(event);
}

writeFile(fileToWrite, JSON.stringify(events), (err) => {
  console.log(err);
});
