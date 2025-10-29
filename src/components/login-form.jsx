import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { Spinner } from "./ui/spinner";

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      setToken(data.token);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-coolBlue font-semibold">
            Login to your account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your email below to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    to="#"
                    className="ml-auto text-sm text-teal hover:text-coolBlue underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-coolBlue text-cream hover:bg-teal active:bg-coral transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <Spinner className="mr-2" /> Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
                {error && (
                  <p className="mt-2 text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                    {error}
                  </p>
                )}
                <FieldDescription className="text-center text-gray-700">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/user/sign-up"
                    className="text-teal hover:text-coolBlue underline"
                  >
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
