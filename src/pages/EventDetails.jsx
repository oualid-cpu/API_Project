import { useParams, Link } from "react-router-dom";
export default function EventDetails() {
  const { id } = useParams();
  return (
    <div className="space-y-2">
      <Link to="/" className="link">
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold">Event #{id}</h1>
      <p>Replace with API data for this event.</p>
    </div>
  );
}
