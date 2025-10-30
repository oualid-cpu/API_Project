// TODO: Fix issue with Sign-up where the user needs to log in again after creating an account

import { useState } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { setToken, setUserProfile } from "@/lib/auth";
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
import { Link, useNavigate } from "react-router-dom";

export function SignupForm({ className, onSignup, closeModal, ...props }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const data = await api("/api/users", {
        method: "POST",
        body: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
      });

      if (data.token) {
        setToken(data.token);
        setUserProfile({
          name: data.name,
          email: data.email,
        });

        if (onSignup) onSignup();

        if (closeModal) closeModal();

        if (!closeModal) navigate("/");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold text-coolBlue">
            Create your account
          </CardTitle>
          <CardDescription className="text-gray-700">
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                </div>
                <FieldDescription className="text-gray-600">
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              {error && (
                <p className="text-red-600 text-center mt-2 bg-red-50 border border-red-200 rounded-md p-2">
                  {error}
                </p>
              )}
              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-coolBlue text-cream hover:bg-teal active:bg-coral transition-colors duration-200"
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center text-gray-700 mt-2">
                  Already have an account?{" "}
                  <Link
                    to="/user/login"
                    className="text-teal hover:text-coolBlue underline"
                  >
                    Sign in
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
