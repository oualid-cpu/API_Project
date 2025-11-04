import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { fetchUserProfile, getUserData } from "@/lib/auth";
import { Link } from "react-router-dom";

export default function UserAvatar({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      if (!id) {
        const profile = await fetchUserProfile();
        setUser(profile);
      } else {
        const profile = await getUserData(id);
        setUser({ name: profile });
      }
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
        {img ? (
          <AvatarImage src={img} alt={name} />
        ) : (
          <AvatarFallback className="bg-emerald-200 text-gray-700 font-semibold">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
      <Link to="/user/dashboard" className="cursor-pointer">
        <button className="font-medium text-gray-800 hover:underline cursor-pointer">
          {name}
        </button>
      </Link>
    </div>
  );
}
