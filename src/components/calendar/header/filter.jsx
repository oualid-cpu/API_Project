"use client";

import { CheckIcon, Filter, RefreshCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";

export default function FilterEvents() {
  const {
    selectedColors = [],
    filterEventsBySelectedColors,
    clearFilter,
  } = useCalendar();

  const colors = ["blue", "green", "red", "yellow", "purple", "orange"];
  const eventType = {
    "Live Music": "blue",
    "Street Festival": "green",
    "Cultural Event": "purple",
    Marathon: "red",
    "Tech Conference": "orange",
    "Holiday Market": "yellow",
    Other: "gray",
  };

  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Toggle variant="outline" className="cursor-pointer w-fit">
          <Filter className="h-4 w-4" />
        </Toggle>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[150px]">
        {colors.map((color, index) => (
          <DropdownMenuItem
            key={index}
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              filterEventsBySelectedColors?.(color);
            }}
          >
            <div
              className={`h-3.5 w-3.5 rounded-full bg-${color}-600 dark:bg-${color}-700`}
            />
            <span className="capitalize flex justify-center items-center gap-2">
              {getKeyByValue(eventType, color)}
              {selectedColors.includes?.(color) && (
                <CheckIcon className="h-4 w-4 text-blue-500" />
              )}
            </span>
          </DropdownMenuItem>
        ))}

        <Separator className="my-2" />
        <DropdownMenuItem
          disabled={selectedColors.length === 0}
          className="flex gap-2 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            clearFilter?.();
          }}
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Clear Filter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
