import { useEffect, useState } from "react";
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

  const verifyToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No token found in localStorage");
      return false;
    }

    if (token.startsWith('"') && token.endsWith('"')) {
      const cleanToken = token.slice(1, -1);
      localStorage.setItem("authToken", cleanToken);
      console.warn("Removed quotes from token");
      return true;
    }

    return true;
  };

  useEffect(() => {
    if (!verifyToken()) {
      setError({
        projects: "Authentication required",
        departments: "Authentication required",
        employees: "Authentication required",
      });
      setLoading({
        projects: false,
        departments: false,
        employees: false,
      });
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch projects
        const projectsRes = await instance.get("/api/auth/welcome");
        const projectsData = Array.isArray(projectsRes.data)
          ? projectsRes.data
          : Array.isArray(projectsRes.data?.content)
          ? projectsRes.data.content
          : [];
        setProjects(projectsData);

        // Fetch departments
        const deptRes = await instance.get("/departments");
        const deptData = Array.isArray(deptRes.data) ? deptRes.data : [];
        setDepartments(deptData);

        // Fetch employees
        const empRes = await instance.get("/employee/all");
        const empData = Array.isArray(empRes.data)
          ? empRes.data
          : Array.isArray(empRes.data?.content)
          ? empRes.data.content
          : [];
        const sorted = [...empData].sort(
          (a, b) => (b.salary || 0) - (a.salary || 0)
        );
        setEmployees(sorted);
      } catch (err) {
        console.error("API Error:", err);
        if (err.response?.status === 403) {
          setError({
            projects: "Access denied - check authentication",
            departments: "Access denied - check authentication",
            employees: "Access denied - check authentication",
          });
        } else {
          setError({
            projects: "Failed to load projects",
            departments: "Failed to load departments",
            employees: "Failed to load employees",
          });
        }
      } finally {
        setLoading({
          projects: false,
          departments: false,
          employees: false,
        });
      }
    };

    fetchData();
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
