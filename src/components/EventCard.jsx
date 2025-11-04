import { useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { getImages } from "@/lib/imageapi";
import { Link } from "react-router-dom";

export default function EventCard({ id, title, description, date, location }) {
  const [eventImage, setEventImage] = useState();
  function formatDateSplit(dateString) {
    const date = new Date(dateString);

    const day = date.toLocaleDateString("en-GB", { day: "2-digit" }); // "24"
    const month = date.toLocaleDateString("en-GB", { month: "short" }); // "aug"
    const year = date.getFullYear(); // 2025

    return {
      firstLine: `${day} ${month}`, // "24aug"
      secondLine: `${year}`, // "2025"
    };
  }

  const { firstLine, secondLine } = formatDateSplit(date);
  useEffect(() => {
    (async () => {
      try {
        const images = await getImages(title);
        setEventImage(images.results[0].urls.full);
      } catch (err) {
        console.error("Failed to load Images:", err);
      }
    })();
  }, []);
  return (
    <CardContainer className="inter-var">
      <CardBody className="relative group/card flex flex-col h-full hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-black/80 border-white/[0.2] border-black/[0.1] w-auto rounded-xl p-6 border">
        <div className="card-headline flex justify-between items-start">
          <div className="flex flex-col">
            <CardItem translateZ="50" className="text-xl font-bold text-white">
              {title}
            </CardItem>
            <CardItem translateZ="30" className="text-sm  text-white/70">
              {location}
            </CardItem>
          </div>
          <div className=" bg-teal text-white text-xs px-2 py-4 rounded-md shadow flex flex-col items-center">
            <p className="font-extrabold">{firstLine}</p>
            <p className="">{secondLine}</p>
          </div>
        </div>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src={eventImage}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-sm max-w-sm mt-2 text-neutral-300 line-clamp-3"
        >
          {description}
        </CardItem>
        <div className="flex justify-between items-center mt-8">
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
          >
            <Link to={`events/${id}`}>More Info</Link>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
