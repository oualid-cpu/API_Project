import { useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { getImages } from "@/lib/imageapi";
import { Link } from "react-router-dom";

export default function EventCard({ id, title, description, date, location }) {
  const [eventImage, setEventImage] = useState(null);

  function formatDateSplit(d) {
    const dt = new Date(d);
    if (!d || Number.isNaN(dt.getTime()))
      return { firstLine: "No", secondLine: "date" };
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
        const url =
          images?.results?.[0]?.urls?.regular ??
          images?.results?.[0]?.urls?.full ??
          null;
        if (alive) setEventImage(url);
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

        <div className="mt-8">
          <CardItem
            translateZ={20}
            as={Link}
            to={`/events/${id}`} // absolute path; avoids weird relative routing
            className="inline-block px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
          >
            More Info
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
