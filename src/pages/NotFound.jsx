import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Link } from "react-router-dom";
import ET from "@/assets/404_icon.svg?react";

export default function NotFound() {
  const [gifUrl, setGifUrl] = useState("");
  const insults = [
    "Why are you here? Why are you like this?",
    "Go look for your page elsewhere, we don't have it here. Idiot.",
    "You had one job — type the URL correctly. One job.",
    "OMG! Hi! I've never met a dummy before! How are you? How did you get here?",
    "Well done, you broke the internet. Again.",
    "404: Intelligence not found.",
    "This page has gone on vacation. You should too.",
    "Lost? Or just vibing in the wrong neighborhood?",
    "Congratulations, you’ve reached the digital equivalent of a brick wall.",
    "There used to be a page here. Then you showed up.",
    "You clicked the wrong thing. We’re all judging you silently.",
    "You’re like Indiana Jones, but dumber and with less success.",
    "This page doesn’t exist, but your curiosity does. Cute.",
    "Did you just type that URL by hand? Bold move, genius.",
    "No page here, but at least you found disappointment.",
    "You're the reason we can’t have nice URLs.",
    "This isn’t the page you’re looking for. Or any page, really.",
    "404: You’ve officially lost the game.",
    "You really thought that would work? Adorable.",
    "Even Google doesn’t know what you’re trying to do.",
    "Bruh. Just... bruh.",
    "Plot twist: the page never existed. Dun dun duuun.",
    "Nice try, hacker. But this isn’t the Matrix.",
    "I hope you’re proud of yourself, because this page sure isn’t.",
    "Oh look, another digital explorer without a map.",
    "At least you found *something*, even if it’s failure.",
    "You just 404’d harder than Internet Explorer on launch day.",
    "This page is hiding because of you.",
    "A wild 404 appears! It uses confusion. It’s super effective!",
    "Your URL typing skills are... unique.",
    "This is fine. Everything is fine. Except you. You’re lost.",
    "You’ve reached the void. It’s empty, like your search history.",
    "This page ghosted you. Savage.",
  ];

  const [insult, setInsult] = useState("");

  useEffect(() => {
    setInsult(insults[Math.floor(Math.random() * insults.length)]);
    const fetchGif = async () => {
      try {
        const res = await fetch(
          `https://api.giphy.com/v1/gifs/random?api_key=${
            import.meta.env.VITE_GIPHY_API_KEY
          }&tag=fail&rating=pg-13`
        );
        const data = await res.json();
        setGifUrl(data?.data?.images?.downsized_large?.url);
      } catch (err) {
        console.error("Error fetching GIF:", err);
      }
    };
    fetchGif();
  }, []);

  return (
    <section id="404">
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
        <h1 className="text-8xl font-bold text-red-500 mb-4">404</h1>

        {insult && (
          <TextGenerateEffect
            words={insult}
            className="text-2xl font-semibold text-foreground max-w-2xl mb-8"
          />
        )}

        {gifUrl ? (
          <img
            src={gifUrl}
            alt="Fail GIF"
            className="rounded-2xl shadow-lg w-full max-w-md mb-10"
          />
        ) : (
          <p className="text-muted-foreground mb-10">
            Fetching a quality fail...
          </p>
        )}

        <Link to="/">
          <Button size="lg" className="text-lg">
            Phone Home? <ET className="w-6 h-6 fill-white" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
