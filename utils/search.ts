import { CalendarEvent } from "@/lib/store/Slice/calendarSlice";

export function searchEvents(
  events: CalendarEvent[],
  query: string
): CalendarEvent[] {
  if (!query.trim()) return events;

  const lowerQuery = query.toLowerCase();

  return events.filter((event) => {
    return (
      event.title.toLowerCase().includes(lowerQuery) ||
      (event.description?.toLowerCase().includes(lowerQuery) ?? false) ||
      event.category.toLowerCase().includes(lowerQuery)
    );
  });
}
