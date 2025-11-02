"use client";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, Text, User, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { AddEditEventDialog } from "@/components/calendar/dialogs/add-edit-event-dialog";
import { formatTime } from "@/components/calendar/helpers";
import { getUserProfileFromStorage, getUserData } from "@/lib/auth"; // adjust path if needed

export function EventDetailsDialog({ event, children }) {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const { use24HourFormat, removeEvent } = useCalendar();
  const currentUser = getUserProfileFromStorage();
  const [organiserName, setOrganiserName] = useState("Unknown Organiser");

  useEffect(() => {
    async function fetchOrganiser() {
      try {
        const name = await getUserData(event.organizerId);
        if (name) setOrganiserName(name);
      } catch (err) {
        console.error("Failed to get Organiser Name", err);
      }
    }
    if (event.organizerId) fetchOrganiser();
  }, [event.organizerId]);

  const deleteEvent = (eventId) => {
    try {
      removeEvent(eventId);
      toast.success("Event deleted successfully.");
    } catch {
      toast.error("Error deleting event.");
    }
  };

  const canEditOrDelete = currentUser.id === event.organizerId;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-4 p-4">
            <div className="flex items-start gap-2">
              <User className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Organiser</p>
                <p className="text-sm text-muted-foreground">
                  {organiserName || "Unknown"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Start Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(startDate, "EEEE dd MMMM")}
                  <span className="mx-1">at</span>
                  {formatTime(startDate, use24HourFormat)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">End Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(endDate, "EEEE dd MMMM")}
                  <span className="mx-1">at</span>
                  {formatTime(endDate, use24HourFormat)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {event.location}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Text className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        {canEditOrDelete && (
          <div className="flex justify-end gap-2">
            <AddEditEventDialog event={event}>
              <Button variant="outline">Edit</Button>
            </AddEditEventDialog>
            <Button variant="destructive" onClick={() => deleteEvent(event.id)}>
              Delete
            </Button>
          </div>
        )}

        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
