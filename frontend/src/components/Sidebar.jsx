import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom"; 

export default function Sidebar({ onMyAccountClick }) {
  
  const [open, setOpen] = useState(false);

  return (
    <> 
      <button className="menu-toggle" onClick={() => setOpen(!open)}>
        {open ? <X size={22} color="#ff8fa3" /> : <Menu size={22} color="#ff8fa3" />}
      </button>

      {/* Bočna Traka */}
      <aside className={`sidebar${open ? "open" : ""}`}>
        <h2 className="sidebar-title">Task Manager</h2>
        <nav className="sidebar-links">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/lists">Lists</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          </nav>

      <div className="sidebar-footer">
       
    <a      href="#" 
            className="sidebar-link-btn" 
            onClick={(e) => {
              e.preventDefault(); 
              setOpen(false);     
              onMyAccountClick(); 
            }}
          >
            {/* ikonica */}
            <User size={18} /> My Account
          </a>
    <NavLink to="/logout" onClick={() => setOpen(false)}>
      <LogOut size={18} /> Logout
    </NavLink>
  </div>
      </aside>
    </>
  );
}
