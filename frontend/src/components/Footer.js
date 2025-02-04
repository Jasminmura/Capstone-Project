import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-center text-light py-3 mt-auto">
      <p className="mb-0">
        &copy; {new Date().getFullYear()} Weather Guide | All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;