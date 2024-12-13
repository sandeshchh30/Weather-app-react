import './App.css';
import Dropdown from './components/Dropdown';
import { Meteors } from './components/ui/meteors';

function App() {

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex justify-center items-center">
      <div
        className="w-10/12 md:w-5/12 p-8 pb-10 rounded-3xl z-10 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 shadow-2xl relative overflow-hidden border border-gray-700"
        style={{
          boxShadow:
            "0px 10px 30px rgba(0, 0, 0, 0.6), 0px 20px 40px rgba(50, 50, 100, 0.4), inset 0px 1px 0px rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-gray-800 opacity-20 rounded-3xl pointer-events-none"></div>

        <div className="flex justify-center">
          <Dropdown />
        </div>
      </div>

      <Meteors number={20} />
    </div>

  );
}

export default App;
