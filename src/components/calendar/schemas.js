import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  location: z.string().min(1, "Location is required"),
  eventType: z.enum(
    [
      "Live Music",
      "Street Festival",
      "Cultural Event",
      "Marathon",
      "Tech Conference",
      "Holiday Market",
      "Other",
    ],
    { required_error: "Event type is required" }
  ),
});
