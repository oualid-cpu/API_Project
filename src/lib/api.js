import { getToken } from "./auth";
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export async function api(path, { method = "GET", body, headers } = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  // console.log(`${BASE}${path}`);
  const text = await res.text();

  const data = text ? JSON.parse(text) : null;
  if (!res.ok)
    throw { status: res.status, message: data?.message || res.statusText };
  return data;
}
