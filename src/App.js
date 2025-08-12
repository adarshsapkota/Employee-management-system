import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./Components/Navigation";
import LoadingSpinner from "./Components/LoadingSpinner";
import "./App.css";
import LogIn from "./Components/auth/LogIn";
import SignUp from "./Components/auth/SignUp";
import UserDash from "./User/UserDash";

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
            <Route path="/" element={<LogIn />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/department" element={<Department />} />
            <Route path="/project" element={<Project />} />
            <Route path="/userdash" element={<UserDash />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
