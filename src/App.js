import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Employee from "./Components/Employee";
import Department from "./Components/Department";
import Project from "./Components/Project";
import Navigation from "./Components/Navigation";

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Employee" element={<Employee />} />
          <Route path="/Department" element={<Department />} />
          <Route path="/Project" element={<Project />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
