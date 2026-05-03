import axios from "axios";
import { useAuthStore } from "../store/authStore";

// @ts-ignore
const BASE = import.meta.env.VITE_API_URL || "";

const client: any = axios.create({ baseURL: BASE });

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(err.response?.data?.detail || err.message);
    }
    const message = err.response?.data?.detail || err.response?.statusText || err.message || "An unexpected error occurred.";
    window.dispatchEvent(new CustomEvent("api-error", { detail: message }));
    return Promise.reject(message);
  }
);

export const api = {
  auth: {
    register: (data: any) => client.post("/api/auth/register", data),
    login: (data: any) => client.post("/api/auth/login", data),
    me: () => client.get("/api/auth/me"),
  },
  chat: {
    getConversations: () => client.get("/api/chat/conversations"),
    createConversation: () => client.post("/api/chat/conversations"),
    deleteConversation: (id: string) => client.delete(`/api/chat/conversations/${id}`),
  },
  quiz: {
    getQuestions: (topicId: string, limit = 10, difficulty?: string) => {
      let url = `/api/quiz/questions/${topicId}?limit=${limit}`;
      if (difficulty && difficulty !== "all") {
        url += `&difficulty=${encodeURIComponent(difficulty)}`;
      }
      return client.get(url);
    },
    submitScore: (data: any) => client.post("/api/quiz/scores", data),
    getScores: () => client.get("/api/quiz/scores"),
  },
  elections: {
    getPhases: (country: string) => client.get(`/api/elections/${country}`),
    list: () => client.get("/api/elections"),
  },
  users: {
    updateProfile: (data: any) => client.patch("/api/users/me", data),
    getGuideProgress: () => client.get("/api/users/me/guide-progress"),
    updateGuideProgress: (stepId: number, completed: boolean, checklistState: any) =>
      client.post(`/api/users/me/guide-progress/${stepId}`, null, {
        params: { completed, checklist_state: JSON.stringify(checklistState) }
      }),
  },
};
