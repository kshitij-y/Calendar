import moment from "moment";
import { CalendarEvent } from "@/lib/store/Slice/calendarSlice";

export function validateEvent(event: CalendarEvent): string[] {
  const errors: string[] = [];

  const now = moment();
  const start = moment(event.start);
  const end = moment(event.end);

  if (
    !event.title ||
    typeof event.title !== "string" ||
    event.title.trim() === ""
  ) {
    errors.push("Title is required.");
  } else if (event.title.length > 100) {
    errors.push("Title must be under 100 characters.");
  }

  if (event.description && event.description.length > 1000) {
    errors.push("Description is too long (max 1000 characters).");
  }

  if (!start.isValid()) {
    errors.push("Start time is invalid.");
  }

  if (!end.isValid()) {
    errors.push("End time is invalid.");
  }

  if (start.isValid() && end.isValid()) {
    if (start.isBefore(now, "minute")) {
      errors.push("Start time cannot be in the past.");
    }

    if (!end.isAfter(start)) {
      errors.push("End time must be after start time.");
    }
  }

  // ✅ Custom recurrence validation
  if (event.recurrence === "custom") {
    if (
      !event.customRule ||
      !Array.isArray(event.customRule.daysOfWeek) ||
      event.customRule.daysOfWeek.length === 0
    ) {
      errors.push("For custom recurrence, select at least one weekday.");
    }

    const validWeekdays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
    const hasInvalid = event.customRule?.daysOfWeek?.some(
      (d) => !validWeekdays.includes(d)
    );
    if (hasInvalid) {
      errors.push("Custom recurrence contains invalid weekday values.");
    }
  }

  return errors;
}

export function checkTimeConflicts(
  newEvent: CalendarEvent,
  existingEvents: CalendarEvent[]
): string[] {
  const warnings: string[] = [];

  const newStart = moment(newEvent.start);
  const newEnd = moment(newEvent.end);

  for (const event of existingEvents) {
    if (event.id === newEvent.id) continue;

    const existingStart = moment(event.start);
    const existingEnd = moment(event.end);

    const overlap =
      newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);

    if (overlap) {
      warnings.push(
        `Time conflict with event "${event.title}" (${existingStart.format(
          "MMM D, HH:mm"
        )} - ${existingEnd.format("MMM D, HH:mm")})`
      );
    }
  }

  return warnings;
}
