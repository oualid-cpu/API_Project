import { Link } from "react-router-dom";
export default function Home() {
  // placeholder list
  const sample = [
    { id: 1, title: "Sample Event", date: new Date().toISOString() },
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Upcoming Events</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sample.map((e) => (
          <li key={e.id} className="border rounded p-4">
            <h2 className="font-medium">{e.title}</h2>
            <p>{new Date(e.date).toLocaleString()}</p>
            <Link to={`/events/${e.id}`} className="link">
              View details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
