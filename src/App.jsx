import { Link, Outlet } from "react-router-dom";
import { getToken, clearToken } from "./lib/auth";
import { Nav } from "./components/navbar";

export default function App() {
  const authed = !!getToken();

  function signOut() {
    clearToken();
    // simple reload to refresh UI state
    window.location.assign("/");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <Nav />
      </header>
      <main className="mx-auto max-w-5xl p-4 pt-16">
        <Outlet />
      </main>
    </div>
  );
}
