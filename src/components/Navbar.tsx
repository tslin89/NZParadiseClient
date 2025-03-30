import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="">
      <ul className="">
        <li>
          <Link to="/" className="hover:underline">Home</Link>
        </li>
        <li
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className="hover:underline focus:outline-none">
            Personal 
          </button>
          <ul
            className={`absolute left-0 mt-2 bg-white text-black rounded shadow-lg w-32 transition-opacity duration-200 ${
              isDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <li><Link to="/mylisting" className="block px-4 py-2 hover:bg-gray-200">My Listings</Link></li>
            <li><Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-200">Dashboard</Link></li>
            <li><Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</Link></li>
          </ul>
        </li>
        <li>
          <Link to="/" className="hover:underline">Login</Link>
        </li>
        <li>
          <Link to="/" className="hover:underline">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
