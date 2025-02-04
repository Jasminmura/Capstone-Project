// frontend/src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

function NavBar({ isDarkMode, toggleTheme }) {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        <strong>Weather Guide</strong>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMenu"
        aria-controls="navMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navMenu">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/about">
              About
            </Link>
          </li>

          <li className="nav-item d-flex align-items-center ms-3">
            <button
              className="btn btn-sm btn-outline-light"
              onClick={toggleTheme}
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;