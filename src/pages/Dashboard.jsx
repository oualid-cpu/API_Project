import React, { Suspense } from "react";
import { Calendar } from "@/components/calendar/calendar";
import { CalendarSkeleton } from "@/components/calendar/skeletons/calendar-skeleton";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold my-6">Your Dashboard</h1>
      <Suspense fallback={<CalendarSkeleton />}>
        <Calendar />
      </Suspense>
    </div>
  );
}
