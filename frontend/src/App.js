// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EventsList from "./pages/EventsList";
import Register from "./pages/Register";
import ScanAttendance from './pages/ScanAttendance';
import MyCertificates from './pages/MyCertificates'; 
import NotFound from "./pages/NotFound";
import AdminPanel from './pages/AdminPanel';


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<EventsList />} />
            {/* <Route path="/register/:eventId" element={<Register />} /> */}
            <Route path="/register/:id" element={<Register />} />
            <Route path="/scan" element={<ScanAttendance />} /> 
            <Route path="/certificates" element={<MyCertificates />} />
            <Route path="*" element={<NotFound />} />
          <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;