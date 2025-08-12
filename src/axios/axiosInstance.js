import axios from "axios";

const baseURL = "http://172.17.17.96:8080";

const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    // Debug log
    console.log("Token from localStorage:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(
        "No token found in localStorage! Request will be sent without Authorization header."
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response.data?.token) {
      console.log("Saving new token to localStorage:", response.data.token);
      localStorage.setItem("authToken", response.data.token);
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    }
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Timeout error - request took too long");
    }
    if (error.response?.status === 401) {
      console.error("Unauthorized - removing token from localStorage");
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    if (error.response) {
      error.formattedMessage =
        error.response.data?.message ||
        `Server error: ${error.response.status}`;
    } else if (error.request) {
      error.formattedMessage = "No response from server";
    } else {
      error.formattedMessage = "Network error";
    }

    return Promise.reject(error);
  }
);

export default instance;

// ..................................with data

// import axios from "axios";

// const baseURL = "http://172.17.17.96:8080";

// const instance = axios.create({
//   baseURL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Helper functions for auth data
// export const setAuthData = (token, userData) => {
//   localStorage.setItem("authToken", token);
//   localStorage.setItem("userData", JSON.stringify(userData));
// };

// export const getAuthData = () => {
//   const token = localStorage.getItem("authToken");
//   const userData = JSON.parse(localStorage.getItem("userData") || "null");
//   return { token, userData };
// };

// export const clearAuthData = () => {
//   localStorage.removeItem("authToken");
//   localStorage.removeItem("userData");
// };

// // Request interceptor
// instance.interceptors.request.use(
//   (config) => {
//     const { token } = getAuthData();

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {
//       console.warn(
//         "No token found in localStorage! Request will be sent without Authorization header."
//       );
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// instance.interceptors.response.use(
//   (response) => {
//     // Check if response contains new token or user data
//     if (response.data?.token) {
//       const userData = response.data.user || getAuthData().userData;
//       setAuthData(response.data.token, userData);
//     }
//     return response;
//   },
//   (error) => {
//     if (error.code === "ECONNABORTED") {
//       console.error("Timeout error - request took too long");
//       error.formattedMessage = "Request timeout";
//     } else if (error.response?.status === 401) {
//       console.error("Unauthorized - clearing auth data");
//       clearAuthData();
//       window.location.href = "/";
//     } else if (error.response) {
//       error.formattedMessage =
//         error.response.data?.message ||
//         `Server error: ${error.response.status}`;
//     } else if (error.request) {
//       error.formattedMessage = "No response from server";
//     } else {
//       error.formattedMessage = "Network error";
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;
