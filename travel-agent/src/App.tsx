import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import FlightSearch from './components/FlightSearch';
import HotelSearch from './components/HotelSearch';
import CarRental from './components/CarRental';
import TravelPlanner from './components/TravelPlanner';
import AIChat from './components/AIChat';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/flights" element={<FlightSearch />} />
              <Route path="/hotels" element={<HotelSearch />} />
              <Route path="/cars" element={<CarRental />} />
              <Route path="/planner" element={<TravelPlanner />} />
              <Route path="/ai-chat" element={<AIChat />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        ;
      </div>
    </Router>
  );
}

export default App;
