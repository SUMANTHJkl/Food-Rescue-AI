import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
});

// Helper API functions with fallback resilience
export const getSurplus = async () => {
  try {
    const res = await api.get("/surplus/");
    return res.data;
  } catch (err) {
    console.warn("API GET /surplus failed:", err.message);
    throw err;
  }
};

export const fetchSurplusList = getSurplus;

export const claimSurplus = async (surplusId, payload = {}) => {
  try {
    const res = await api.post(`/surplus/${surplusId}/claim`, payload);
    return res.data;
  } catch (err) {
    console.warn(`API POST /surplus/${surplusId}/claim failed:`, err.message);
    throw err;
  }
};

export const postSurplusItem = async (data) => {
  try {
    const res = await api.post("/surplus/", data);
    return res.data;
  } catch (err) {
    console.warn("API POST /surplus/ failed:", err.message);
    throw err;
  }
};

export const predictSafety = async (foodType, cookedTime, storageCond) => {
  try {
    const res = await api.post("/predictions/safety", {
      food_type: foodType,
      cooked_time: cookedTime,
      storage_condition: storageCond
    });
    return res.data;
  } catch (err) {
    console.warn("API POST /predictions/safety failed:", err.message);
    throw err;
  }
};

export const getAnalyticsSummary = async () => {
  try {
    const res = await api.get("/analytics/summary");
    return res.data;
  } catch (err) {
    console.warn("API GET /analytics/summary failed:", err.message);
    throw err;
  }
};

export const getAlerts = async () => {
  try {
    const res = await api.get("/notifications/");
    return res.data;
  } catch (err) {
    console.warn("API GET /notifications/ failed:", err.message);
    throw err;
  }
};

export const chatAI = async (message, context = "") => {
  try {
    const res = await api.post("/ai/copilot", { prompt: message, context });
    return res.data;
  } catch (err) {
    console.warn("API POST /ai/copilot failed:", err.message);
    throw err;
  }
};

export const getBioWasteList = async () => {
  try {
    const res = await api.get("/farmers/biowaste");
    return res.data;
  } catch (err) {
    console.warn("API GET /farmers/biowaste failed:", err.message);
    throw err;
  }
};

export const claimBioWaste = async (claimData) => {
  try {
    const res = await api.post("/farmers/claim", claimData);
    return res.data;
  } catch (err) {
    console.warn("API POST /farmers/claim failed:", err.message);
    throw err;
  }
};
