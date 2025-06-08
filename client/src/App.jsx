import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navb from "./components/navbar";
import Navba from "./components/pages/Navba";
import Homepage from "./components/Homepage";
import Login from "./components/pages/Login";
import Registration from "./components/pages/Registration";
import CreateEvent from "./components/pages/createAEvent";
import MyEvents from "./components/pages/myEvents";
import EventEdit from "./components/pages/EventEdit";
import EventDetails from "./components/pages/EventDetails";

function App() {
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  const handleLogout = () => {
    setRole("null");
    localStorage.removeItem("role");
  };

  const handleUserLogin = () => {
    setRole("User");
  };

  return (
    <div className="App">
      <Router>
        {role === "null" && <Navb setRole={setRole} />}
        {role === "User" && (
          <Navba setRole={setRole} onLogout={handleLogout} />
        )}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login setRole={handleUserLogin} />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/CreateEvent" element={<CreateEvent />} />
          <Route path="/Events" element={<MyEvents />} />
          <Route path="/edit/:eventId" element={<EventEdit/>} />
          <Route path="/eventDetails/:eventId" element={<EventDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
