import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import style from "../styles/Navbar.module.css";

export default function Navbar() {
  const location = useLocation().pathname;
  const [activeLink, setActiveLink] = useState(location);
  const navLink = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About Us",
      path: "/about",
    },
    {
      name: "Projects",
      path: "/project",
    },
    {
      name: "Services",
      path: "/services",
    },
    {
      name: "Contact Us",
      path: "/contact",
    },
  ];
  return (
    <nav className={style.navContainer}>
      <p className={style.logo}>Logo</p>
      <ul className={style.navLinks}>
        {navLink.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className={activeLink === link.path ? style.active : ""}
              onClick={() => setActiveLink(link.path)}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
