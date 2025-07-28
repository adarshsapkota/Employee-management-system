import { useState, useEffect } from "react";
import "./Project.css";
import instance from "../axios/axiosInstance";

function Project() {
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    departmentId: "",
    description: "",
    startDate: "",
    status: "Planned",
    budget: "",
    assignedEmployees: [],
  });
  const statusOptions = ["Planned", "Ongoing", "Completed", "Cancelled"];

  // Toggle views
  const handleAdd = () => setShowAddForm(true);
  const handleList = () => setShowAddForm(false);

  // Fetch departments
  useEffect(() => {
    instance
      .get("/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments", err));
  }, []);

  // Fetch employees
  useEffect(() => {
    instance
      .get("/employee")
      .then((res) => setEmployees(res.data.content))
      .catch((err) => console.error("Error fetching employees", err));
  }, []);

  // Fetch projects
  useEffect(() => {
    instance
      .get("/api/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    instance
      .delete(`/api/projects/${id}`)
      .then(() => {
        setProjects((prev) => prev.filter((pro) => pro.projectId !== id));
      })
      .catch((err) => {
        console.error("Error deleting project:", err);
        alert("Failed to delete project.");
      });
  };

  const handleEmployeeSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) =>
      Number(opt.value)
    );
    setFormData((prev) => ({
      ...prev,
      assignedEmployees: selected,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      projectName: formData.projectName.trim(),
      departmentId: Number(formData.departmentId),
      description: formData.description.trim(),
      startDate: formData.startDate,
      status: formData.status,
      budget: parseFloat(formData.budget),
      employees: formData.assignedEmployees.map((id) => ({ id })),
    };

    instance
      .post("/api/projects", payload)
      .then((res) => {
        console.log("Project added:", res.data);
        setProjects((prev) => [...prev, res.data]);
        setShowAddForm(false);
        setFormData({
          projectName: "",
          departmentId: "",
          description: "",
          startDate: "",
          status: "Planned",
          budget: "",
          assignedEmployees: [],
        });
      })
      .catch((err) => {
        console.error("Failed to add project:", err);
      });
  };

  return (
    <div className="project-container">
      <div className="project-sidebar">
        <button onClick={handleAdd} className="add">
          Add Project
        </button>
        <button onClick={handleList} className="list">
          Project List
        </button>
      </div>

      <div className="project-content">
        {showAddForm ? (
          <div className="project-form">
            <h3>Add New Project</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Name:</label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department:</label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dep) => (
                    <option key={dep.departmentId} value={dep.departmentId}>
                      {dep.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Budget:</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Assign Employees:</label>
                <select
                  multiple
                  name="assignedEmployees"
                  value={formData.assignedEmployees}
                  onChange={handleEmployeeSelect}
                  required
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employeeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-action">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="project-list">
            <h3>Project List</h3>
            <table className="project-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Budget</th>
                  <th>Employees</th>
                  <th>Changes</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((pro) => (
                  <tr key={pro.projectId}>
                    <td>{pro.projectId}</td>
                    <td>{pro.projectName}</td>
                    <td>
                      {pro.departmentName || pro.department?.departmentName}
                    </td>
                    <td>{pro.status}</td>
                    <td>{pro.budget}</td>
                    <td>
                      {(pro.employees || [])
                        .map((e) => e.employeeName)
                        .join(", ")}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(pro.projectId)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Project;
