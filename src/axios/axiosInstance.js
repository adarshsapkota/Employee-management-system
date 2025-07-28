// import axios from "axios";

// const baseURL = "http://172.17.17.96:8080";
// const instance = axios.create({
//   baseURL: baseURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// instance.defaults.headers["Access-Control-Allow-Origin"] = "*";
// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.code === "ECONNABORTED") {
//       console.error("Timeout error - request took too long");
//     } else if (error.response) {
//       // Server responded with non-2xx status
//       console.error("Server error:", error.response.status);
//     } else if (error.request) {
//       // Request made but no response
//       console.error("No response received:", error.request);
//     } else {
//       // Other errors
//       console.error("Request setup error:", error.message);
//     }
//     return Promise.reject(error);
//   }
// );
// export default instance;

import axios from "axios";

const baseURL = "http://172.17.17.96:8080";

const instance = axios.create({
  baseURL,
  timeout: 10000, // optional
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Timeout error - request took too long");
    } else if (error.response) {
      console.error("Server error:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
