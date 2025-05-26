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

    // Handle custom recurrence (weekly by daysOfWeek)
    if (event.recurrence === "custom" && event.customRule?.daysOfWeek?.length) {
      const eventStart = moment(event.start);
      const eventEnd = moment(event.end);
      const durationMs = eventEnd.diff(eventStart);

      const current = rangeStart.clone().startOf("day");
      while (current.isSameOrBefore(rangeEnd)) {
        const dow = current.format("dd").toUpperCase(); // e.g. "MO"

        if (event.customRule.daysOfWeek.includes(dow)) {
          const newStart = current.clone().set({
            hour: eventStart.hour(),
            minute: eventStart.minute(),
            second: 0,
          });

          const newEnd = newStart.clone().add(durationMs, "ms");

          expanded.push({
            ...event,
            id: `${event.id}-${current.format("YYYYMMDD")}`,
            start: newStart.toISOString(),
            end: newEnd.toISOString(),
          });
        }

        current.add(1, "day");
      }

      continue;
    }

    // Handle normal recurrence types
    const unit = freqMap[event.recurrence as RecurrenceType];
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
