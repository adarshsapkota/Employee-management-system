import { useState, useEffect } from "react";
import "./Department.css";
import instance from "../axios/axiosInstance";

function Department() {
  const [department, setDepartment] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    departmentName: "",
    description: "",
  });
  const [error, setError] = useState("");

  const handleAdd = () => {
    setShowAddForm(true);
    setError("");
  };

  const handleList = () => {
    setShowAddForm(false);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      departmentName: formData.departmentName.trim(),
      description: formData.description.trim(),
    };
    console.log("Sending department payload:", payload);

    try {
      const res = await instance.post("/departments", payload);
      console.log("Department added:", res.data);
      setDepartment((prev) => [...prev, res.data]);
      setFormData({ departmentName: "", description: "" });
      setShowAddForm(false);
      setError("");
    } catch (err) {
      console.error("Error adding department:", err);
      const errMsg = err.response?.data?.message || "Failed to add department.";
      setError(errMsg);
    }
  };

  useEffect(() => {
    instance
      .get("/departments")
      .then((response) => {
        console.log("Departments fetched successfully:", response.data);
        setDepartment(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  return (
    <div className="department-container">
      <div className="department-sidebar">
        <button onClick={handleAdd} className="add">
          Add Department
        </button>
        <button onClick={handleList} className="list">
          Department List
        </button>
      </div>

      <div className="department-content">
        {showAddForm ? (
          <div className="department-form">
            <h3>Add New Department</h3>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Department Name</label>
                <input
                  type="text"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-action">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="department-list">
            <h3>Department List</h3>
            <table className="department-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Department Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {department.map((dep) => (
                  <tr key={dep.departmentId}>
                    <td>{dep.departmentId}</td>
                    <td>{dep.departmentName}</td>
                    <td>{dep.description}</td>
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

export default Department;
