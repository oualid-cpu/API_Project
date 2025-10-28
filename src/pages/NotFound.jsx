import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link to="/" className="link">
        Go home
      </Link>
    </div>
  );
}
