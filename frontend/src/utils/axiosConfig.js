import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Use Bearer if your backend expects it
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// // RESPONSE INTERCEPTOR (handle auth errors) OR WHEN TOKEN EXPIRES
// axios.interceptors.response.use(
//   (response) => response, // success → pass through

//   (err) => {
//     if (err.response?.status === 401) {
//       console.log("Token expired or unauthorized");

//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }

//     return Promise.reject(err);
//   }
// );

export default axios;

//export default api;