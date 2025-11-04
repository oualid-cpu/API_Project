import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getImages } from "@/lib/imageapi";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

/* ---------- helpers: robust date detection & formatting ---------- */
function pick(obj, path) {
  return path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

function getFirstDateValue(evt) {
  if (!evt) return null;
  // Try common flat keys and a couple nested shapes
  const candidates = [
    "date",
    "eventDate",
    "startsAt",
    "startDate",
    "datetime",
    "time",
    "date.start",
    "start",
    "schedule.date",
  ];
  for (const p of candidates) {
    const v = p.includes(".") ? pick(evt, p) : evt[p];
    if (v != null && v !== "") return v;
  }
  return null;
}

function prettyWhen(value) {
  if (value == null || value === "") return null;

  // Numeric timestamp?
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
  }

  const s = String(value).trim();
  let d = new Date(s); // ISO, RFC, etc.

  // Handle "YYYY-MM-DD HH:mm" (no 'T')
  if (Number.isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(s)) {
    d = new Date(s.replace(" ", "T"));
  }

  // Handle date-only "YYYY-MM-DD"
  if (Number.isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
    d = new Date(`${s}T00:00:00`);
  }

  // If still invalid, show raw text so user sees something
  return Number.isNaN(d.getTime()) ? s : d.toLocaleString();
}
/* ---------------------------------------------------------------- */

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(true);
  const [err, setErr] = useState("");

  // 1) Fetch event by ID
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/events/${id}`);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        if (alive) setEvent(data);
      } catch (e) {
        setErr(e.message || "Failed to load event");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  // 2) Fetch hero image for the event title (fallback gradient if none)
  useEffect(() => {
    if (!event?.title) return;
    let alive = true;
    (async () => {
      try {
        const images = await getImages(event.title);
        const url =
          images?.results?.[0]?.urls?.regular ??
          images?.results?.[0]?.urls?.full ??
          null;
        if (alive) setImgUrl(url);
      } catch {
        // ignore; gradient fallback below
      } finally {
        if (alive) setImgLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [event?.title]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-4 space-y-6">
        <div className="h-64 w-full animate-pulse rounded-xl bg-gray-200" />
        <div className="space-y-3">
          <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-800">
          {err}
        </div>
        <Link to="/" className="mt-4 inline-block text-blue-700 underline">
          ← Back to events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <p>Event not found.</p>
        <Link to="/" className="mt-4 inline-block text-blue-700 underline">
          ← Back to events
        </Link>
      </div>
    );
  }

  const when = prettyWhen(getFirstDateValue(event)) || "No date";

  return (
    <div className="mx-auto max-w-5xl p-0 sm:p-4">
      {/* HERO */}
      <div className="relative h-64 w-full overflow-hidden rounded-none sm:rounded-2xl">
        {/* fallback gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
        {/* image (if available) */}
        {imgUrl && (
          <img
            src={imgUrl}
            alt={`${event.title} hero`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        )}
        {/* overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* title + chips */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <h1 className="text-2xl font-bold sm:text-3xl">{event.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 backdrop-blur">
              🗓️ <span className="ml-2">{when}</span>
            </span>
            {event.location && (
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                📍 <span className="ml-2">{event.location}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <Link to="/" className="text-blue-700 underline">
          ← Back to events
        </Link>

        <section className="mt-4 rounded-2xl border border-black/10 bg-green-200/80 p-5 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">About this event</h2>
          {event.description ? (
            <p className="whitespace-pre-wrap leading-relaxed text-gray-800">
              {event.description}
            </p>
          ) : (
            <p className="text-gray-500">No description provided.</p>
          )}
        </section>
      </div>
    </div>
  );
}
