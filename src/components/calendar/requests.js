const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";
import { getToken } from "@/lib/auth";

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

export async function apiAddEvent(event) {
  const token = getToken();
  if (!token) throw new Error("No auth token found");

  try {
    const res = await fetch(`${API_BASE}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to add event: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error adding event:", err);
    throw err;
  }
}

export async function apiUpdateEvent(id, event) {
  const token = getToken();
  if (!token) throw new Error("No auth token found");

  try {
    const res = await fetch(`${API_BASE}/api/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to update event: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error updating event:", err);
    throw err;
  }
}

export const apiDeleteEvent = async (id) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/events/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      `Failed to delete event: ${res.status} ${data.message || res.statusText}`
    );
  }

  return;
};
