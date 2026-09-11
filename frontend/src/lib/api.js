import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const api = axios.create({ baseURL: `${BACKEND_URL}/api`, withCredentials: true });

let refreshing = null;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    if (response?.status === 401 && config && !config._retry && !config.url.includes("/auth/")) {
      config._retry = true;
      try {
        refreshing = refreshing || api.post("/auth/refresh");
        await refreshing;
        refreshing = null;
        return api(config);
      } catch (e) {
        refreshing = null;
      }
    }
    return Promise.reject(error);
  },
);

export const assetUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
};

export function formatApiError(err, fallback = "Something went wrong. Please try again.") {
  const detail = err?.response?.data?.detail;
  if (detail == null) return err?.message || fallback;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => (typeof e?.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  if (typeof detail?.msg === "string") return detail.msg;
  return String(detail);
}

export const experienceLabel = (start, end) => {
  const endYear = /^\d{4}$/.test(String(end)) ? Number(end) : new Date().getFullYear();
  const years = Math.max(1, endYear - Number(start));
  return { range: `${start} — ${end}`, years: `${years}+ Years Experience` };
};
