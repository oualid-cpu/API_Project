// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function Home() {
  const [events, setEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const getEvents = (list) => {
    const today = new Date();
    const upcoming = list.filter((event) => new Date(event.startDate) >= today);
    const past = list.filter((event) => new Date(event.startDate) < today);
    upcoming.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    past.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    setEvents(upcoming);
    setPastEvents(past);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/events`);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        if (!alive) return;
        const list = Array.isArray(data.results) ? data.results : [];

        getEvents(list);
      } catch (e) {
        setErr(e.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <div className="p-4">Loading events…</div>;
  if (err)
    return (
      <div className="p-4">
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-800">
          {err}
        </div>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Upcoming Events</h1>

        <Link
          to="/user/dashboard"
          className="rounded-lg bg-black px-3 py-2 text-white hover:opacity-90"
        >
          + Create
        </Link>
      </header>

      {events.length === 0 ? (
        <p className="text-gray-600">No events yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => {
            const id = ev.id ?? ev._id; // support either key
            return (
              <li
                key={id}
                className="rounded-xl border p-4 bg-white/20 backdrop-blur-md hover:shadow"
              >
                <Link to={`/events/${id}`} className="block">
                  <h2 className="line-clamp-1 text-lg font-medium">
                    {ev.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {ev.startDate
                      ? new Date(ev.startDate).toLocaleString()
                      : "No date"}
                  </p>
                  {ev.location && (
                    <p className="mt-1 text-sm text-gray-700">{ev.location}</p>
                  )}
                  {ev.description && (
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                      {ev.description}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <section>
        <h2 className="text-2xl font-semibold">Past Events</h2>
        {pastEvents.length === 0 ? (
          <p className="text-gray-600">No past events.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((ev) => {
              const id = ev.id ?? ev._id; // support either key
              return (
                <li
                  key={id}
                  className="rounded-xl border p-4 bg-white/20 backdrop-blur-md hover:shadow"
                >
                  <Link to={`/events/${id}`} className="block">
                    <h2 className="line-clamp-1 text-lg font-medium">
                      {ev.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {ev.startDate
                        ? new Date(ev.startDate).toLocaleString()
                        : "No date"}
                    </p>
                    {ev.location && (
                      <p className="mt-1 text-sm text-gray-700">
                        {ev.location}
                      </p>
                    )}
                    {ev.description && (
                      <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                        {ev.description}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
