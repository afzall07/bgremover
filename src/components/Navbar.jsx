import React from "react";
import { SiRemovedotbg } from "react-icons/si";
import "./Navbar.css";
import BgRemove from "./BgRemove";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo cursor-pointer">
          <SiRemovedotbg className="navbar-icon" />
          <Link className="navbar-title" to={"/"}>
            remove<span className="dot">bg</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
