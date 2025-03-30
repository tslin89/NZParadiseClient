import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import "./App.css";
import logo from "./logo-main.png";

function App() {
  return (
    <Router>
      <div className="container">
        <header>
          <img src={logo} alt="Logo" className="logo" />
          <Navbar />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
