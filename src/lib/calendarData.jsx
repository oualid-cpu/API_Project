import { api } from "@/lib/api";

export const getEvents = async () => {
  const data = await api(`/api/events?_=${Date.now()}`);
  return Array.isArray(data.results) ? data.results : [];
};
export const getEvent = async (id) => {
  const data = await api(`/api/events/${id}`);
  return data;
};
export const getUpcomingEvents = async () => {
  const data = await api(`/api/events/upcoming`);
  return Array.isArray(data.results) ? data.results : [];
};

export const getUsers = async () => {
  const data = await api(`/api/users?_=${Date.now()}`);
  return Array.isArray(data) ? data : [];
};
