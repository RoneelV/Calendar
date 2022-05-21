import { useEffect, useState } from 'react';
import EventList from './EventList';
import Loading from './Loading';
import eventsList from '../eventsList.json';

function App() {
  /** @type {[Object.<string, import('../mockEvents').event[]>, Function]} */
  const [dateEvents, setDateEvents] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // eventDate is formatted as yyyy-MM-dd so can compare as string
    eventsList.sort((a, b) => (a.eventDate < b.eventDate ? -1 : 1));

    /** @type {Object.<string, import('../mockEvents').event[]>} */
    let dateEvents = {};
    eventsList.forEach((event) => {
      if (dateEvents[event.eventDate]) {
        dateEvents[event.eventDate].push(event);
      } else {
        dateEvents[event.eventDate] = [event];
      }
    });
    setDateEvents(dateEvents);
    setLoading(false);
  }, []);

  return (
    <div className="container p-12">
      {loading ? <Loading /> : <EventList dateEvents={dateEvents} />}
    </div>
  );
}

export default App;
