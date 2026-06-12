import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getContacts = () => api.get("/contacts/");
export const getContact = (email) => api.get(`/contacts/${email}`);
export const createContact = (data) => api.post("/contacts/", data);
export const getActions = () => api.get("/actions/");
export const getResponses = () => api.get("/responses/");
export const getEmails = () => api.get("/emails/");
export const getThreads = () => api.get("/threads/");
export const getThread = (threadId) => api.get(`/threads/${threadId}`);
export const ingestEmail = (data) => api.post("/api/ingest", data);
export const analyzeEmail = (sender, query) =>
  api.get("/agent/analyze", { params: { sender, query } });

export default api;
