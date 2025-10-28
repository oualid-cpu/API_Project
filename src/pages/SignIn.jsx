import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { setToken } from "../lib/auth";
import { LoginForm } from "@/components/login-form";

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

  return <LoginForm />;
}
