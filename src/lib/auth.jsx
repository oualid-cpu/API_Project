const TOKEN_KEY = "api_token";
const USER_KEY = "user_profile";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const setUserProfile = (profile) =>
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
export const getUserProfileFromStorage = () => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export async function fetchUserProfile() {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(
      `${
        import.meta.env.VITE_API_BASE || "http://localhost:3001"
      }/api/auth/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch profile");
    const profile = await res.json();
    setUserProfile(profile); // save to localStorage
    return profile;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
}
