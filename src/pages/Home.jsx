// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// If you already use the @ alias, keep these:
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { getImages } from "@/lib/imageapi";

// If you DON'T have the @ alias, replace the two lines above with relative imports, e.g.:
// import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";
// import { getImages } from "../lib/imageapi";

const API_BASE = import.meta.env.VITE_API_BASE; // set in .env

// --- Inline EventCard component ---
function EventCard({ id, title, description, date, location }) {
  const [eventImage, setEventImage] = useState(null);

  function formatDateSplit(dateString) {
    const dt = new Date(dateString);
    if (isNaN(dt.getTime())) return { firstLine: "No", secondLine: "date" };
    const day = dt.toLocaleDateString("en-GB", { day: "2-digit" });
    const month = dt
      .toLocaleDateString("en-GB", { month: "short" })
      .toUpperCase();
    const year = dt.getFullYear();
    return { firstLine: `${day} ${month}`, secondLine: `${year}` };
  }

  const { firstLine, secondLine } = formatDateSplit(date);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const images = await getImages(title);
        const first =
          images?.results?.[0]?.urls?.regular ||
          images?.results?.[0]?.urls?.full ||
          null;
        if (alive) setEventImage(first);
      } catch (err) {
        console.error("Failed to load Images:", err);
        if (alive) setEventImage(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [title]);

  return (
    <CardContainer className="inter-var">
      <CardBody className="relative group/card flex flex-col h-full hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-black/80 border-white/[0.2] border-black/[0.1] w-auto rounded-xl p-6 border">
        <div className="card-headline flex justify-between items-start">
          <div className="flex flex-col">
            <CardItem translateZ="50" className="text-xl font-bold text-white">
              {title}
            </CardItem>
            <CardItem translateZ="30" className="text-sm text-white/70">
              {location || "—"}
            </CardItem>
          </div>
          <div className="bg-teal text-white text-xs px-2 py-4 rounded-md shadow flex flex-col items-center">
            <p className="font-extrabold">{firstLine}</p>
            <p>{secondLine}</p>
          </div>
        </div>

        <CardItem translateZ="100" className="w-full mt-4">
          <div className="h-60 w-full overflow-hidden rounded-xl group-hover/card:shadow-xl bg-gradient-to-br from-gray-700 to-gray-900">
            {eventImage ? (
              <img
                src={eventImage}
                height="1000"
                width="1000"
                loading="lazy"
                className="h-60 w-full object-cover"
                alt={`${title} cover`}
              />
            ) : (
              <div className="h-60 w-full flex items-center justify-center text-white/70 text-sm">
                Image unavailable
              </div>
            )}
          </div>
        </CardItem>

        <CardItem
          as="p"
          translateZ="60"
          className="text-sm max-w-sm mt-2 text-neutral-300 line-clamp-3"
        >
          {description || "No description"}
        </CardItem>

        <div className="flex justify-between items-center mt-8">
          <CardItem
            translateZ={20}
            as={Link}
            to={`/events/${id}`} // absolute route
            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
          >
            More Info
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}

// --- Home page (FR008) ---
export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/events`);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        if (!alive) return;
        const list = Array.isArray(data) ? data : [];
        list.sort((a, b) => new Date(a.date) - new Date(b.date)); // chronological ASC
        setEvents(list);
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
    <div className="mx-auto max-w-6xl p-4">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Upcoming Events</h1>
        <Link
          to="/events/new"
          className="rounded-lg bg-black px-3 py-2 text-white hover:opacity-90"
        >
          + Create
        </Link>
      </header>

      {events.length === 0 ? (
        <p className="text-gray-600">No events yet.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <li key={ev.id ?? ev._id}>
              <EventCard
                id={ev.id ?? ev._id}
                title={ev.title}
                description={ev.description}
                date={ev.date}
                location={ev.location}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
