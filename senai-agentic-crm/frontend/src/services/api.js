import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getContacts = () => api.get("/contacts/");
export const getContact = (email) => api.get(`/contacts/${email}`);
export const getActions = () => api.get("/actions/");
export const getResponses = () => api.get("/responses/");

export default api;
