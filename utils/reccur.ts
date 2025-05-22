import moment from "moment";
import { CalendarEvent } from "@/lib/store/Slice/calendarSlice";

export function expandRecurringEvents(
  events: CalendarEvent[],
  rangeStart: moment.Moment,
  rangeEnd: moment.Moment
): CalendarEvent[] {
  const expanded: CalendarEvent[] = [];

  for (const event of events) {
    if (!event.recurrence || event.recurrence === "none") {
      expanded.push(event);
      continue;
    }

    type RecurrenceType = "daily" | "weekly" | "monthly" | "yearly";
    const freqMap: Record<
      RecurrenceType,
      moment.unitOfTime.DurationConstructor
    > = {
      daily: "days",
      weekly: "weeks",
      monthly: "months",
      yearly: "years",
    };

    if (event.recurrence === "custom") continue;

    const unit = freqMap[event.recurrence];
    let start = moment(event.start);
    let end = moment(event.end);

    while (start.isSameOrBefore(rangeEnd)) {
      if (end.isSameOrAfter(rangeStart)) {
        expanded.push({
          ...event,
          id: `${event.id}-${start.format("YYYYMMDD")}`,
          start: start.toISOString(),
          end: end.toISOString(),
        });
      }
      start = start.clone().add(1, unit);
      end = end.clone().add(1, unit);
    }
  }

  return expanded;
}
