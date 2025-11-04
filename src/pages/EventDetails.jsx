import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getImages } from "@/lib/imageapi";
import { getEvent } from "@/lib/calendarData";
import { generateCopyFromEvent } from "@/lib/aiCopy";
import ReactMarkdown from "react-markdown";
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
  const [eventData, setEventData] = useState();
  const [cachedCopy, setCachedCopy] = useState(null);
  const [eventImage, setEventImage] = useState();
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const { id } = useParams();

  function formatDateSplit(dateString) {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("en-GB", { day: "2-digit" });
    const month = date.toLocaleDateString("en-GB", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  useEffect(() => {
    (async () => {
      try {
        const cacheKey = `cachedEventData_${id}`;
        let cachedDataRaw = localStorage.getItem(cacheKey);
        let cachedData = cachedDataRaw ? JSON.parse(cachedDataRaw) : {};

        const currentEvent = await getEvent(id);
        setEventData(currentEvent);

        if (cachedData.aiCopy) {
          setCachedCopy(cachedData.aiCopy);
        } else {
          setAiLoading(true);
          const generatedCopy = await generateCopyFromEvent(currentEvent);
          setCachedCopy(generatedCopy);
          cachedData.aiCopy = generatedCopy;
          localStorage.setItem(cacheKey, JSON.stringify(cachedData));
          setAiLoading(false);
        }

        if (cachedData.eventImage) {
          setEventImage(cachedData.eventImage);
        } else {
          const images = await getImages(currentEvent.title);
          const imgUrl = images.results[0]?.urls?.full || "";
          setEventImage(imgUrl);
          cachedData.eventImage = imgUrl;
          localStorage.setItem(cacheKey, JSON.stringify(cachedData));
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to load event or cached data:", error);
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
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

  const formattedDate = eventData ? formatDateSplit(eventData.startDate) : "";

  return (
    <Card>
      <div className="space-y-2">
        <CardHeader className="flex justify-between">
          <CardTitle className="text-4xl font-bold mb-6">
            {eventData?.title}
            <p className="text-xs mt-2 text-coral font-medium">
              {formattedDate}
            </p>
          </CardTitle>
          <div className="avatar">
            <p className="text-xs text-black/40 mb-2">Organiser: </p>
            <UserAvatar id={eventData?.organizerId} />
          </div>
        </CardHeader>
        <CardContent>
          <img
            className="rounded-xl mb-6"
            src={eventImage}
            alt={eventData?.title}
          />
          <CardDescription>
            {aiLoading ? (
              <p>
                <Spinner /> Loading AI copy…
              </p>
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p className="mb-4 font-normal" {...props} />
                  ),
                }}
              >
                {cachedCopy || eventData?.description || ""}
              </ReactMarkdown>
            )}
          </CardDescription>
        </CardContent>
      </div>
    </Card>
  );
}
