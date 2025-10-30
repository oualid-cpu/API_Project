import { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "@/components/calendar/hooks";

const DEFAULT_SETTINGS = {
  badgeVariant: "colored",
  view: "day",
  use24HourFormat: true,
  agendaModeGroupBy: "date",
};

const CalendarContext = createContext({});

export function CalendarProvider({
  children,
  users,
  events = [],
  badge = "colored",
  view = "day",
}) {
  const [settings, setSettings] = useLocalStorage("calendar-settings", {
    ...DEFAULT_SETTINGS,
    badgeVariant: badge,
    view,
  });

  const [badgeVariant, setBadgeVariantState] = useState(settings.badgeVariant);
  const [currentView, setCurrentViewState] = useState(settings.view);
  const [use24HourFormat, setUse24HourFormatState] = useState(
    settings.use24HourFormat
  );
  const [agendaModeGroupBy, setAgendaModeGroupByState] = useState(
    settings.agendaModeGroupBy
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUserId, setSelectedUserId] = useState("all");
  const [selectedColors, setSelectedColors] = useState([]);

  const [allEvents, setAllEvents] = useState(events);
  const [filteredEvents, setFilteredEvents] = useState(events);

  // 🧠 THIS IS THE FIX:
  // Whenever new events are passed into the provider (after fetching), update internal state
  useEffect(() => {
    if (Array.isArray(events)) {
      setAllEvents(events);
      setFilteredEvents(events);
    }
  }, [events]);

  const updateSettings = (partial) => setSettings({ ...settings, ...partial });

  const setBadgeVariant = (variant) => {
    setBadgeVariantState(variant);
    updateSettings({ badgeVariant: variant });
  };

  const setView = (newView) => {
    setCurrentViewState(newView);
    updateSettings({ view: newView });
  };

  const toggleTimeFormat = () => {
    const newValue = !use24HourFormat;
    setUse24HourFormatState(newValue);
    updateSettings({ use24HourFormat: newValue });
  };

  const setAgendaModeGroupBy = (groupBy) => {
    setAgendaModeGroupByState(groupBy);
    updateSettings({ agendaModeGroupBy: groupBy });
  };

  const filterEventsBySelectedColors = (color) => {
    const isSelected = selectedColors.includes(color);
    const newColors = isSelected
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];

    setSelectedColors(newColors);
    setFilteredEvents(
      newColors.length === 0
        ? allEvents
        : allEvents.filter((e) => newColors.includes(e.color || "blue"))
    );
  };

  const filterEventsBySelectedUser = (userId) => {
    setSelectedUserId(userId);
    setFilteredEvents(
      userId === "all"
        ? allEvents
        : allEvents.filter((event) => event.user?.id === userId)
    );
  };

  const handleSelectDate = (date) => date && setSelectedDate(date);

  const addEvent = (event) => {
    setAllEvents((prev) => [...prev, event]);
    setFilteredEvents((prev) => [...prev, event]);
  };

  const updateEvent = (event) => {
    const updated = {
      ...event,
      startDate:
        typeof event.startDate === "string"
          ? event.startDate
          : new Date(event.startDate).toISOString(),
      endDate:
        typeof event.endDate === "string"
          ? event.endDate
          : new Date(event.endDate).toISOString(),
    };

    setAllEvents((prev) => prev.map((e) => (e.id === event.id ? updated : e)));
    setFilteredEvents((prev) =>
      prev.map((e) => (e.id === event.id ? updated : e))
    );
  };

  const removeEvent = (eventId) => {
    setAllEvents((prev) => prev.filter((e) => e.id !== eventId));
    setFilteredEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const clearFilter = () => {
    setFilteredEvents(allEvents);
    setSelectedColors([]);
    setSelectedUserId("all");
  };

  const value = {
    selectedDate,
    setSelectedDate: handleSelectDate,
    selectedUserId,
    setSelectedUserId,
    badgeVariant,
    setBadgeVariant,
    users,
    selectedColors,
    filterEventsBySelectedColors,
    filterEventsBySelectedUser,
    events: filteredEvents,
    view: currentView,
    use24HourFormat,
    toggleTimeFormat,
    setView,
    agendaModeGroupBy,
    setAgendaModeGroupBy,
    addEvent,
    updateEvent,
    removeEvent,
    clearFilter,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context)
    throw new Error("useCalendar must be used within a CalendarProvider.");
  return context;
}
