import { useState, useEffect } from "react";
import { getEvents } from "@/lib/calendarData";
import EventCard from "@/components/EventCard";
export default function Home() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        setEvents(await getEvents());
      } catch (err) {
        console.error("Failed to load calendar data:", err);
      }
    })();
  }, []);

  return (
    <section id="homePage pt-6">
      <h1 className="text-3xl font-bold mt-6">Upcoming Events</h1>
      <div className="grid grid-cols-3 gap-5">
        {events.map((event) => (
          <EventCard
            key={(event.id * 10202) / 32}
            id={event.id}
            title={event.title}
            description={event.description}
          />
        ))}
      </div>
    </section>
  );
}
