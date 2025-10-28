import { Link, Outlet } from "react-router-dom";
import { getToken, clearToken } from "./lib/auth";

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
        <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <Link to="/" className="font-semibold">
            Events
          </Link>
          <div className="flex items-center gap-3">
            {authed ? (
              <>
                <Link to="/events/new" className="btn btn-primary">
                  New Event
                </Link>
                <button onClick={signOut} className="btn">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="btn">
                  Sign In
                </Link>
                <Link to="/sign-up" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
