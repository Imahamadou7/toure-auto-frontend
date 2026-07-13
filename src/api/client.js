import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000, // évite qu'une requête reste bloquée indéfiniment
});

// 🔒 récupération sécurisée du token
const getToken = () => {
  try {
    const token = localStorage.getItem("tas_token");

    if (
      !token ||
      token === "undefined" ||
      token === "null" ||
      token.trim() === ""
    ) {
      return null;
    }

    return token;
  } catch {
    return null;
  }
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Gestion centralisée des erreurs API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("tas_token");
      localStorage.removeItem("tas_user");
    }

    return Promise.reject(error);
  }
);

export default api;