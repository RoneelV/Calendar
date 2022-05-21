import Event from './Event';
import eventsList from '../eventsList.json';

function App() {
  return (
    <div className="container">
      <Event event={eventsList[0]} />
    </div>
  );
}

export default App;
