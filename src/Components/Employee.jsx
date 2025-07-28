import { useEffect, useState } from "react";
import "./Employee.css";
import instance from "../axios/axiosInstance";

function Employee() {
  const [editMode, setEditMode] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    phoneNumber: "",
    email: "",
    hireDate: "",
    role: "",
    salary: "",
    departmentName: "",
  });
  const [error, setError] = useState("");

  const handleAdd = () => {
    setShowAddForm(true);
    setEditMode(false);
    setEditingEmployeeId(null);
    setFormData({
      employeeName: "",
      phoneNumber: "",
      email: "",
      hireDate: "",
      role: "",
      salary: "",
      departmentName: "",
    });
    setError("");
  };

  const handleList = () => {
    setShowAddForm(false);
    setEditMode(false);
    setEditingEmployeeId(null);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }
    instance
      .delete(`/employee/${id}`)
      .then(() => {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      })
      .catch((error) => {
        console.error("Delete failed", error);
        setError("Failed to delete employee.");
      });
  };

  const handleEdit = (employee) => {
    setEditMode(true);
    setShowAddForm(true);
    setEditingEmployeeId(employee.id);
    setFormData({
      employeeName: employee.employeeName,
      phoneNumber: employee.phoneNumber,
      email: employee.email,
      hireDate: employee.hireDate,
      role: employee.role,
      salary: employee.salary,
      departmentName: employee.departmentName,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedDepartment = departments.find(
      (dep) => dep.departmentName === formData.departmentName
    );

    if (!selectedDepartment) {
      setError("Invalid department selected.");
      return;
    }

    const payload = {
      employeeName: formData.employeeName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      hireDate: formData.hireDate,
      role: formData.role,
      salary: parseFloat(formData.salary),
      departmentId: selectedDepartment.departmentId,
    };

    const request = editMode
      ? instance.put(`/employee/${editingEmployeeId}`, payload)
      : instance.post("/employee", payload);

    request
      .then((response) => {
        const updatedEmployee = response.data;

        if (editMode) {
          setEmployees((prev) =>
            prev.map((emp) =>
              emp.id === editingEmployeeId ? updatedEmployee : emp
            )
          );
        } else {
          setEmployees((prev) => [...prev, updatedEmployee]);
        }

        setShowAddForm(false);
        setEditMode(false);
        setEditingEmployeeId(null);
        setFormData({
          employeeName: "",
          phoneNumber: "",
          email: "",
          hireDate: "",
          role: "",
          salary: "",
          departmentName: "",
        });
        setError("");
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message || "Submission failed.");
        } else {
          setError("An unexpected error occurred.");
        }
      });
  };

  useEffect(() => {
    instance
      .get("/employee")
      .then((response) => {
        setEmployees(response.data.content);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);

  useEffect(() => {
    instance
      .get("/departments")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  return (
    <div className="employee-container">
      <div className="employee-sidebar">
        <button onClick={handleAdd} className="add">
          Add Employee
        </button>
        <button onClick={handleList} className="list">
          Employee List
        </button>
      </div>

      <div className="employee-content">
        {showAddForm ? (
          <div className="employee-form">
            <h3>{editMode ? "Update Employee" : "Add New Employee"}</h3>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hire Date:</label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role:</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Salary:</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department:</label>
                <select
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dep) => (
                    <option key={dep.departmentId} value={dep.departmentName}>
                      {dep.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={
                    !formData.employeeName ||
                    !formData.phoneNumber ||
                    !formData.email ||
                    !formData.hireDate ||
                    !formData.role ||
                    !formData.salary ||
                    !formData.departmentName
                  }
                >
                  {editMode ? "Update" : "Submit"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditMode(false);
                    setEditingEmployeeId(null);
                    setFormData({
                      employeeName: "",
                      phoneNumber: "",
                      email: "",
                      hireDate: "",
                      role: "",
                      salary: "",
                      departmentName: "",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="employee-list">
            <h3>Employee List</h3>
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Salary</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.employeeName}</td>
                    <td>{emp.role}</td>
                    <td>{emp.departmentName}</td>
                    <td>{emp.phoneNumber}</td>
                    <td>{emp.email}</td>
                    <td>{emp.salary}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(emp)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(emp.id)}
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

export default Employee;
