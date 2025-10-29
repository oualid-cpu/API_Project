import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { fetchUserProfile } from "@/lib/auth";

export default function UserAvatar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const profile = await fetchUserProfile();
      setUser(profile);
    })();
  }, []);

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(user?.name);
  const img = user?.img;
  const name = user?.name || "Guest";

  return (
    <div className="user-info flex items-center gap-2">
      <Avatar className="h-10 w-10">
        <AvatarImage src={img} alt={name} />
        <AvatarFallback className="bg-emerald-200 text-gray-700 font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <p className="font-medium text-gray-800">{name}</p>
    </div>
  );
}
