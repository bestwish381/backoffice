import React from "react";
import "./Header.css";
import logo from "./logo.png";

function Header({ searchQuery, setSearchQuery }) {
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="header-container">
      <div className="header-logo">
        <img className="logo" src={logo} alt="Logo de la Empresa" />
      </div>
      {/* <div className="header-search">
        <input 
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div> */}
    </div>
  );
}

export default Header;
