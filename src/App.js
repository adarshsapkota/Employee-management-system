import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./Components/Navigation";
import LoadingSpinner from "./Components/LoadingSpinner";
import "./App.css";

const Dashboard = lazy(() => import("./Components/Dashboard"));
const Employee = lazy(() => import("./Components/Employee"));
const Department = lazy(() => import("./Components/Department"));
const Project = lazy(() => import("./Components/Project"));

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/department" element={<Department />} />
            <Route path="/project" element={<Project />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
