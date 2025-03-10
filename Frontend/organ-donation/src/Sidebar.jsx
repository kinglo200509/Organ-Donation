import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";

const menuItems = [
  { name: "Home", icon: "home", path: "/" },
  { name: "Dashboard", icon: "dashboard", path: "/dashboard" },
  { name: "Explore", icon: "explore", path: "/explore" },
  { name: "Organ Search", icon: "volunteer_activism", path: "/organ-search" },
  { name: "Settings", icon: "settings", path: "/settings" },
  { name: "Account", icon: "person", path: "/account" },
  { name: "Report", icon: "report", path: "/report" },
  { name: "Contact", icon: "email", path: "/contact" },
  { name: "Logout", icon: "logout", path: "/logout" },
];

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  // Check if the current route is "Organ Search"
  const isOrganSearchPage = location.pathname === "/organ-search";

  return (
    <div
      className={`sidebar ${isExpanded ? "expanded" : "collapsed"} ${
        isOrganSearchPage ? "red-theme" : "blue-theme"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <ul className="menu-list">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `menu-link ${isActive ? "active" : ""}`
              }
            >
              <span className="material-symbols-outlined icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
