"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMinutes, format, set } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/responsive-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { COLORS, EVENTTYPE } from "@/components/calendar/constants";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { useDisclosure } from "@/components/calendar/hooks";
import { eventSchema } from "@/components/calendar/schemas";
import { apiAddEvent, apiUpdateEvent } from "../requests";
import { getUserProfileFromStorage } from "@/lib/auth";

import MapWithMarker from "@/components/MapWithMarker";

export function AddEditEventDialog({ children, startDate, startTime, event }) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const { addEvent, updateEvent } = useCalendar();
  const isEditing = !!event;
  const currentUser = getUserProfileFromStorage();

  // State for latitude and longitude linked to the map and location field
  const [coords, setCoords] = useState({
    lat: event?.latitude || null,
    lng: event?.longitude || null,
  });

  const initialDates = useMemo(() => {
    if (!isEditing && !event) {
      const now = new Date();
      const start = startTime
        ? set(new Date(startDate || now), {
            hours: startTime.hour,
            minutes: startTime.minute,
            seconds: 0,
          })
        : new Date(startDate || now);
      const end = addMinutes(start, 30);
      return { startDate: start, endDate: end };
    }
    return {
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
    };
  }, [startDate, startTime, event, isEditing]);

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      startDate: initialDates.startDate,
      endDate: initialDates.endDate,
      location: event?.location ?? "",
      eventType: event?.eventType ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      title: event?.title ?? "",
      description: event?.description ?? "",
      startDate: initialDates.startDate,
      endDate: initialDates.endDate,
      location: event?.location ?? "",
      eventType: event?.eventType ?? "",
    });

    setCoords({
      lat: event?.latitude || null,
      lng: event?.longitude || null,
    });
  }, [event, initialDates, form]);

  // Debounced geocode from location input updates lat/lng in state
  useEffect(() => {
    const location = form.watch("location");
    if (!location) return;

    const geocode = debounce(async (loc) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            loc
          )}`
        );
        const data = await res.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
        } else {
          setCoords({ lat: null, lng: null });
        }
      } catch (err) {
        console.warn("Geocode error:", err);
        setCoords({ lat: null, lng: null });
      }
    }, 500);

    geocode(location);

    return () => geocode.cancel();
  }, [form.watch("location")]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        startDate: format(values.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(values.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
        location: values.location,
        eventType: values.eventType,
        latitude: coords.lat,
        longitude: coords.lng,
        organizerId: isEditing ? event.organizerId : currentUser.id,
      };

      let savedEvent;
      if (isEditing) {
        savedEvent = await apiUpdateEvent(event.id, payload);
        updateEvent(savedEvent);
        toast.success("Event updated successfully");
      } else {
        savedEvent = await apiAddEvent(payload);
        addEvent(savedEvent);
        toast.success("Event created successfully");
      }

      onClose();
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${isEditing ? "edit" : "add"} event`);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onToggle} modal={false}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{isEditing ? "Edit Event" : "Add New Event"}</ModalTitle>
          <ModalDescription>
            {isEditing
              ? "Modify your existing event."
              : "Create a new event for your calendar."}
          </ModalDescription>
        </ModalHeader>

        <Form {...form}>
          <form
            id="event-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="title" className="required">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Enter a title"
                      {...field}
                      className={fieldState.invalid ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <DateTimePicker form={form} field={field} />
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <DateTimePicker form={form} field={field} />
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="location" className="required">
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="location"
                      placeholder="Enter a location"
                      {...field}
                      className={fieldState.invalid ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Leaflet Map */}
            <div className="mb-4 h-64 rounded-lg overflow-hidden">
              <MapWithMarker
                position={
                  coords.lat !== null && coords.lng !== null
                    ? [coords.lat, coords.lng]
                    : null
                }
                setPosition={(pos) => setCoords({ lat: pos.lat, lng: pos.lng })}
                height={256}
              />
            </div>

            {/* Event Type */}
            <FormField
              control={form.control}
              name="eventType"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="required">Event Type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger
                        className={`w-full ${
                          fieldState.invalid ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select an event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(EVENTTYPE).map((type) => (
                          <SelectItem value={type} key={type}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`size-3.5 rounded-full bg-${EVENTTYPE[type]}-600 dark:bg-${EVENTTYPE[type]}-700`}
                              />
                              {type}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="required">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter a description"
                      className={fieldState.invalid ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <ModalFooter className="flex justify-end gap-2">
          <ModalClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </ModalClose>
          <Button form="event-form" type="submit">
            {isEditing ? "Save Changes" : "Create Event"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
