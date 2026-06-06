import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register         = (data)   => API.post("/auth/register", data);
export const login            = (data)   => API.post("/auth/login", data);
export const loginWithGoogle  = (data)   => API.post("/auth/google", data);
export const loginWithFacebook = (data)   => API.post("/auth/facebook", data);
export const verifyEmail      = (token)  => API.get(`/auth/verify-email/${token}`);
export const getMe            = ()       => API.get("/auth/me");

export const getHouses        = ()       => API.get("/houses");
export const getHouse         = (id)     => API.get(`/houses/${id}`);

export const getEngineers     = ()       => API.get("/engineers");
export const getEngineer      = (id)     => API.get(`/engineers/${id}`);

export const getTerrains      = ()       => API.get("/terrains");
export const estimateTerrain  = (params) => API.get("/terrains/estimate", { params });

export const calculate        = (data)   => API.post("/estimations/calculate", data);
export const getHistory       = ()       => API.get("/estimations");
export const getEstimation    = (id)     => API.get(`/estimations/${id}`); 
// Dans api.js — ajoute ces lignes
export const getProjects     = ()     => API.get("/projects");
export const getMyProjects   = ()     => API.get("/projects/mine");
export const createProject   = (data) => API.post("/projects", data);
export const getApplications = ()     => API.get("/applications/available");
export const getMessages     = (id)   => API.get(`/messages/${id}`);
export const sendMessage     = (data) => API.post("/messages", data);
export const getRegionPrices = ()     => API.get("/region-prices");
export const getAllPricing   = ()     => API.get("/pricing");
export const saveRegionPrice = (data) => API.post("/pricing/regions", data);
export const getMyFurniture  = ()     => API.get("/furniture/mine");
export const addFurniture    = (data) => API.post("/furniture", data);
export const deleteFurniture = (id)   => API.delete(`/furniture/${id}`);

// Equipements
export const getEquipments   = ()     => API.get("/equipments");
export const addEquipment    = (data) => API.post("/equipment", data);
export const updateEquipment = (id, data) => API.put(`/equipment/${id}`, data);
export const deleteEquipment = (id)   => API.delete(`/equipment/${id}`);

// Admin routes
export const getAdminStats      = ()      => API.get("/admin/stats");
export const getAdminUsers      = ()      => API.get("/admin/users");
export const getAdminEngineers  = ()      => API.get("/admin/engineers");
export const deleteAdminUser    = (id)    => API.delete(`/admin/users/${id}`);
export const verifyEngineer     = (id)    => API.put(`/admin/engineers/${id}/verify`);
export const createAdminUser    = (data)  => API.post("/admin/create-admin", data);

export default API;