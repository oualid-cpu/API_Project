"use client";
import { useEffect, useState } from "react";
import { CalendarBody } from "@/components/calendar/calendar-body";
import { CalendarProvider } from "@/components/calendar/contexts/calendar-context";
import { DndProvider } from "@/components/calendar/contexts/dnd-context";
import { CalendarHeader } from "@/components/calendar/header/calendar-header";
import { getEvents, getUsers } from "./requests";
import { getUserProfileFromStorage } from "@/lib/auth";

export function Calendar() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);

  const eventTypeColors = {
    "Live Music": "blue",
    "Street Festival": "green",
    "Cultural Event": "purple",
    Marathon: "red",
    "Tech Conference": "orange",
    "Holiday Market": "yellow",
    Other: "gray",
  };

  // Get current user ID from localStorage
  const currentUserId = getUserProfileFromStorage()?.id;

  useEffect(() => {
    (async () => {
      try {
        const [eventsData, usersData] = await Promise.all([
          getEvents(),
          getUsers(),
        ]);

        const userEvents = Array.isArray(eventsData)
          ? eventsData.filter((e) => e.organizerId === currentUserId)
          : [];

        const transformedEvents = eventsData.map((e) => ({
          ...e,
          startDate: e.startDate,
          endDate: e.endDate,
          location: e.location,
          organiser: e.organizerId,
          color: eventTypeColors[e.eventType] || "gray",
        }));

        setEvents(transformedEvents);

        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error("Failed to load calendar data:", err);
      }
    })();
  }, [currentUserId]);

  return (
    <CalendarProvider events={events} users={users} view="month">
      <DndProvider showConfirmation={false}>
        <div className="w-full border rounded-xl bg-white/50 backdrop-blur-md p-8">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
}
