import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserTable from './UserTable';
import UserDetail from './UserDetail';
import Sidebar from './Sidebar';
import Header from './Header';
import Login from './Login';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const sessionCookie = cookies.find(cookie => cookie.startsWith('session='));
    if (sessionCookie) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="app">
        {isLoggedIn && <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        <div className="content">
          {isLoggedIn && <Sidebar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          <div className="main-content">
            <Routes>
              <Route path="/" element={isLoggedIn ? <UserTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> : <Navigate to="/login" />} />
              <Route path="/user/:email" element={isLoggedIn ? <UserDetail /> : <Navigate to="/login" />} />
              <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/user-table" element={isLoggedIn ? <UserTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> : <Navigate to="/login" />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
