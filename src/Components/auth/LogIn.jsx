import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../axios/axiosInstance";
import "./LogIn.css";
import { jwtDecode } from "jwt-decode";

function LogIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    delete instance.defaults.headers.common["Authorization"];
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await instance.post("/api/auth/login", {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      const token = response.data;
      localStorage.setItem("authToken", token);

      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const decode = jwtDecode(token);
      const userDetails = {
        employeeName: decode.employeeName,
        phoneNumber: decode.phoneNumber,
        email: decode.phoneNumber,
        hireDate: decode.hireDate,
        role: decode.role || [],
      };
      localStorage.setItem("userDetails", JSON.stringify(userDetails));

      if (userDetails.role.includes("ADMIN")) {
        navigate("/dashboard");
      } else {
        navigate("/userdash");
      }
    } catch (err) {
      console.error("Login error:", err);
      localStorage.removeItem("authToken");
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        await instance.get("/api/auth/welcome");
        console.log("Backend connection successful");
      } catch (err) {
        console.error("Backend connection failed:", err);
      }
    };
    testBackendConnection();
  }, []);

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Welcome Back</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="login-button"
          disabled={loading || !formData.email || !formData.password}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="login-footer">
          <span>
            Don't have an account? <Link to="/SignUp">Sign Up</Link>
          </span>
        </div>
      </form>
    </div>
  );
}

export default LogIn;
