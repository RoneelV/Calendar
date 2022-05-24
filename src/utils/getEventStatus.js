/**
 * @param {number} seatsLeft
 * @param {boolean} hasRegistered
 */
export const getEventStatus = (seatsLeft, hasRegistered) => {
  if (hasRegistered) return 'Booked';
  if (seatsLeft >= 10) return 'Available';

  return 'Filling fast';
};
