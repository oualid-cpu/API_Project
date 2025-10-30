const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export const getEvents = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/events?_=${Date.now()}`);
    if (!res.ok) throw new Error("Failed to fetch events");
    const data = await res.json();

    return Array.isArray(data.results) ? data.results : [];
  } catch (err) {
    console.error("Error fetching events:", err);
    return [];
  }
};

export const getUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/users?_=${Date.now()}`);
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    return Array.isArray(data.results) ? data.results : [];
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
};
