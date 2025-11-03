import { useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { getImages } from "@/lib/imageapi";
import { Link } from "react-router-dom";

export default function EventCard({ id, title, description }) {
  const [eventImage, setEventImage] = useState();
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
      <CardBody className="relative group/card  hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-black border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl p-6 border  ">
        <CardItem translateZ="50" className="text-xl font-bold text-white">
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-sm max-w-sm mt-2 text-neutral-300"
        >
          {description}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src={eventImage}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
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
