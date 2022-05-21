const { faker } = require('@faker-js/faker');
const {
  add,
  sub,
  getHours,
  hoursToMinutes,
  getMinutes,
  startOfDay,
  endOfDay,
  formatISO,
} = require('date-fns');
const { writeFile } = require('fs');

const fileToWrite = 'src/eventsList.json';
const totalEvents = faker.datatype.number({ min: 20, max: 60 });

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

const eventFactory = () => {
  const eventDate = faker.date.between(startDate, endDate);

  // add random amount of minutes to the start of eventDate
  // returns any Date between 00:00 to 22:00 on eventDate
  const startTime = add(startOfDay(eventDate), {
    minutes: faker.datatype.number({ min: 0, max: 60 * 22, precision: 5 }),
  });

  // add random amount of minutes to startTime
  // returns any Date between startTime to 23:55 on eventDate
  const endTime = add(startTime, {
    minutes: faker.datatype.number({
      min: 20,
      max:
        getMinutesElapsedInDay(endOfDay(eventDate)) -
        getMinutesElapsedInDay(startTime),
      precision: 5,
    }),
  });

  const instructors = faker.helpers.uniqueArray(
    faker.name.findName,
    faker.datatype.number({ min: 1, max: 2 })
  );

  return {
    eventId: faker.database.mongodbObjectId(),
    // Some marketing words, with the first letter of each string capitalized
    // adds by Name, if there is one instructor
    eventName:
      faker.company
        .bs()
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(' ') + (instructors.length == 1 ? ` by ${instructors[0]}` : ''),
    eventDate: formatISO(eventDate, { representation: 'date' }),
    startTime: formatISO(startTime, { representation: 'time' }),
    endTime: formatISO(endTime, { representation: 'time' }),
    hasRegistered: faker.datatype.boolean(),
    imageURL: 'https://loremflickr.com/640/480/people',
    instructors,
    tags: faker.helpers.arrayElements(
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
    totalAttendees: faker.datatype.number({ min: 20, max: 120 }),
    seatsLeft: faker.datatype.number({ min: 0, max: 70 }),
  };
};

/** @typedef {ReturnType<eventFactory>} event */

/** @type {event[]} */
let events = [];
for (let i = 0; i < totalEvents; i++) {
  events.push(eventFactory());
}

writeFile(fileToWrite, JSON.stringify(events), (err) => {
  if (err) throw err;
  console.log(`Successfully saved ${fileToWrite}`);
});
