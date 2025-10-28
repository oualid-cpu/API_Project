import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { setToken } from "../lib/auth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();
  const loc = useLocation();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const { token } = await api("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setToken(token);
      nav(loc.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm space-y-3">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      {error && <p className="text-red-600">{error}</p>}
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
