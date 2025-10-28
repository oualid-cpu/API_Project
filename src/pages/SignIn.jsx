import { useState } from "react";
import { setToken } from "../lib/auth";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const loc = useLocation();

  function fakeLogin(e) {
    e.preventDefault();
    setToken("FAKE_TOKEN"); // replace with real API login later
    const to = loc.state?.from?.pathname || "/";
    nav(to, { replace: true });
  }

  return (
    <form onSubmit={fakeLogin} className="max-w-sm space-y-3">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <input
        className="input input-bordered w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input input-bordered w-full"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn btn-primary w-full">Sign In</button>
      <p className="text-sm">
        No account?{" "}
        <Link to="/sign-up" className="link">
          Sign up
        </Link>
      </p>
    </form>
  );
}
