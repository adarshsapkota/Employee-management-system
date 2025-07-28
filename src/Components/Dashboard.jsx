import React, { useEffect, useState } from "react";
import instance from "../axios/axiosInstance";
import "./Dashboard.css";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState({
    projects: true,
    departments: true,
    employees: true,
  });
  const [error, setError] = useState({
    projects: null,
    departments: null,
    employees: null,
  });

  useEffect(() => {
    // Fetch projects
    instance
      .get("/api/projects")
      .then((res) => {
        console.log("Projects API response:", res.data);
        setProjects(res.data?.content || res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setError((prev) => ({ ...prev, projects: "Failed to load projects" }));
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, projects: false }));
      });

    // Fetch departments
    instance
      .get("/departments")
      .then((res) => {
        setDepartments(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching departments:", err);
        setError((prev) => ({
          ...prev,
          departments: "Failed to load departments",
        }));
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, departments: false }));
      });

    // Fetch employees
    instance
      .get("/employee")
      .then((res) => {
        const data = res.data?.content || res.data || [];
        const sorted = data.sort((a, b) => b.salary - a.salary);
        setEmployees(sorted);
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
        setError((prev) => ({
          ...prev,
          employees: "Failed to load employees",
        }));
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, employees: false }));
      });
  }, []);

  const getStatusClass = (status) => {
    if (!status) return "";
    const statusLower = status.toLowerCase();
    if (statusLower.includes("planned")) return "planned";
    if (statusLower.includes("ongoing")) return "ongoing";
    if (statusLower.includes("completed")) return "completed";
    if (statusLower.includes("cancelled")) return "cancelled";
    return "";
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard Overview</h1>

      <div className="card-grid">
        <div className="card">
          <h2>Projects</h2>
          {loading.projects ? (
            <div className="loading-spinner">Loading projects...</div>
          ) : error.projects ? (
            <p className="error-message">{error.projects}</p>
          ) : projects.length === 0 ? (
            <p className="no-data">No projects found</p>
          ) : (
            projects.map((project) => {
              const statusClass = getStatusClass(project.status);
              return (
                <div
                  key={project.id || project.projectId}
                  className={`card-item ${statusClass}`}
                >
                  <div className="card-item-content">
                    <strong>{project.projectName || project.name}</strong>
                  </div>
                  {project.status && (
                    <span className={`status-badge status-${statusClass}`}>
                      {project.status}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="card">
          <h2>Departments</h2>
          {loading.departments ? (
            <div className="loading-spinner">Loading departments...</div>
          ) : error.departments ? (
            <p className="error-message">{error.departments}</p>
          ) : departments.length === 0 ? (
            <p className="no-data">No departments found</p>
          ) : (
            <>
              {departments.map((dep) => (
                <div key={dep.departmentId} className="card-item">
                  <strong>{dep.departmentName}</strong>
                </div>
              ))}
              <p className="total-count">
                Total Departments: {departments.length}
              </p>
            </>
          )}
        </div>

        <div className="card">
          <h2>Top Employees (Highest Salary)</h2>
          {loading.employees ? (
            <div className="loading-spinner">Loading employees...</div>
          ) : error.employees ? (
            <p className="error-message">{error.employees}</p>
          ) : employees.length === 0 ? (
            <p className="no-data">No employees found</p>
          ) : (
            <>
              <p className="total-count">Total Employees: {employees.length}</p>
              {employees.slice(0, 5).map((emp) => (
                <div key={emp.id} className="card-item">
                  <div className="employee-details">
                    <strong>{emp.employeeName}</strong>
                    <div className="employee-meta">
                      <span className="salary">
                        NPR {emp.salary.toLocaleString()}
                      </span>
                      <span className="role">{emp.role}</span>
                    </div>
                    <small>{emp.departmentName}</small>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
