import { useState, useEffect, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { getImages } from "@/lib/imageapi";
import { getEvent } from "@/lib/calendarData";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/UserAvatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export default function EventDetails() {
  const [eventImage, setEventImage] = useState();
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState();
  const [date, setDate] = useState();
  const { id } = useParams();

  function formatDateSplit(dateString) {
    const date = new Date(dateString);

    const day = date.toLocaleDateString("en-GB", { day: "2-digit" }); // "24"
    const month = date.toLocaleDateString("en-GB", { month: "short" }); // "aug"
    const year = date.getFullYear(); // 2025

    return `${day} ${month} ${year}`;
  }

  useEffect(() => {
    (async () => {
      try {
        const currentEvent = await getEvent(id);
        setEventData(currentEvent);
        const images = await getImages(currentEvent.title);
        setEventImage(images.results[0].urls.full);
        setDate(formatDateSplit(currentEvent.startDate));
        setLoading(false);
      } catch (err) {
        console.error("Failed to load Event Data:", err);
      }
    })();
  }, []);

  if (!loading) {
    return (
      <Card>
        <div className="space-y-2">
          <CardHeader className="flex justify-between">
            <CardTitle className="text-4xl font-bold mb-6">
              {eventData.title}
              <p className="text-xs mt-2 text-coral font-medium">{date}</p>
            </CardTitle>
            <div className="avatar">
              <p className="text-xs text-black/40 mb-2">Organiser: </p>
              <UserAvatar id={eventData.organizerId} />
            </div>
          </CardHeader>
          <CardContent>
            <img
              className="rounded-xl mb-6"
              src={eventImage}
              alt={eventData.titel}
            />
            <CardDescription>
              <p>{eventData.description}</p>
            </CardDescription>
          </CardContent>
        </div>
      </Card>
    );
  }
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col space-y-3 rounded-xl w-full h-full justify-center">
        <Skeleton className="h-6 w-full rounded-xl bg-black/30 backdrop-blur-sm" />
        <Skeleton className="h-1/3 w-full rounded-xl bg-black/30 backdrop-blur-sm flex justify-center align-center">
          <Spinner className="h-full scale-200" />
        </Skeleton>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-black/30 backdrop-blur-sm" />
          <Skeleton className="h-4 w-full bg-black/30 backdrop-blur-sm" />
        </div>
      </div>
    </div>
  );
}
