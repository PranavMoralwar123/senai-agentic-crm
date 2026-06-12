import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/contacts", label: "Contacts" },
  { to: "/actions", label: "Actions" },
  { to: "/responses", label: "Responses" },
];

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid px-4">
        <NavLink className="navbar-brand fw-semibold" to="/">
          SenAI Agentic CRM
        </NavLink>
        <div className="navbar-nav ms-auto flex-row gap-1">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav-link px-3${isActive ? " active" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
