import { Link, Outlet } from "react-router-dom";
import { getToken, clearToken } from "./lib/auth";
import { Nav } from "./components/navbar";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const authed = !!getToken();

  function signOut() {
    clearToken();
    window.location.assign("/");
  }

  return (
    <div className="relative min-h-screen bg-sky-200">
      <div
        className="absolute inset-0 bg-[url('./assets/doodles.png')] bg-repeat bg-fixed mix-blend-multiply pointer-events-none"
        style={{ backgroundSize: "auto", opacity: 0.6 }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-white/0 pointer-events-none" />
      <Toaster position="top-right" />
      <div className="relative z-10">
        <header className="border-b">
          <Nav />
        </header>
        <main className="mx-auto max-w-5xl p-4 pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
