import "./Navigation.css";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <div className="navigation">
      <h1>DG</h1>
      <Link to="/Dashbaord" className="Link">
        Home
      </Link>

      <Link to="/Department" className="Link">
        Department
      </Link>
      <Link to="/Employee" className="Link">
        Employee
      </Link>
      <Link to="/Project" className="Link">
        Project
      </Link>
    </div>
  );
}

export default Navigation;
