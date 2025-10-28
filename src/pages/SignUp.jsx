import { Link } from "react-router-dom";
export default function SignUp() {
  return (
    <div className="max-w-sm space-y-3">
      <h1 className="text-2xl font-semibold">Create account</h1>
      {/* replace with real form later */}
      <p>Sign-Up form goes here (name, email, password).</p>
      <Link to="/sign-in" className="link">
        Already have an account? Sign in
      </Link>
    </div>
  );
}
